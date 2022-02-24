const jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken/tree/v8.3.0
const logger = require('../logger')('jwtUtils');
const { verifyJWT } = require('./oktaAuth');
const { getUserByID, populateUserRole } = require('../db');
const {
  getUserAffiliatedStates: actualGetUserAffiliatedStates,
  getExpiredUserAffiliations: actualGetExpiredUserAffiliations
  // auditUserLogin: actualAuditUserLogin
} = require('../db/auth');
const {
  updateAuthAffiliation: actualUpdateAuthAffiliation
} = require('../db/affiliations');

/**
 * Returns the payload from the signed JWT, or false.
 * Uses Okta to verify and decode the token.
 * @name verifyWebToken
 * @param {String} token - signed JWT
 * @param {Object} Object containing a verifier to be used.
 * allows for switching between okta and local varification patterns
 * @returns {(Object|Boolean)} JWT payload, or false
 */
const verifyWebToken = (token, { verifier = verifyJWT } = {}) =>
  verifier(token)
    .then(claims => {
      // the token is valid (per Okta)
      return claims;
    })
    .catch(err => {
      // a validation failed, inspect the error
      logger.error(token, `invalid token: ${err.message}`);
      return false;
    });

/**
 * Extracts the JWT from the Request Authorization Header.
 * @name jwtExtractor
 * @param {Object} req - request
 * @returns {(String|null)} JWT string or null
 */
const jwtExtractor = req => {
  const token = req.get('Authorization');

  if (token && token !== '') {
    if (token.match(/^bearer\s/i)) {
      return token.split(' ')[1];
    }
  }

  const { url } = req;
  const cookieStr = req.headers.cookie || req.get('Cookie');
  // eslint-disable-next-line prefer-regex-literals
  const regex = new RegExp(
    /(^\/apds\/(\d+)\/files)|(^\/api\/apds\/(\d+)\/files)|(^\/auth\/certifications\/files\/.*)/i
  );

  if (url && regex.test(url) && cookieStr) {
    // because our image files within the RTE are just img tags
    // we cannot append our authorization header, but because
    // we are storing our access token in a cookie, we can read
    // the access token from there in this instance
    const re = /;\s*/;
    const cookies = cookieStr.split(re); // split the cookie string into individual cookies
    const accessTokenObj = cookies.find(cookie =>
      cookie.match(/^gov.cms.eapd.api-token/i)
    ); // find the cookie that stores the access token
    if (accessTokenObj) {
      // eslint-disable-next-line no-unused-vars
      const value = accessTokenObj.split('=')[1]; // get the value
      const valueObj = JSON.parse(unescape(value)); // the value is an encoded string, convert it to a json object
      return valueObj.accessToken; // return the access token
    }
  }
  return null;
};

// ****** Local JWT implementation below this line
const getSecret = () => {
  return process.env.JWT_SECRET;
};

/*
    algorithm (default: HS256)
    expiresIn || notBefore: expressed in seconds or a string describing a time span zeit/ms.
    Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
    If you use a string be sure you provide the time units (days, hours, etc),
    otherwise milliseconds unit is used by default ("120" is equal to "120ms").
 */
const defaultOptions = {
  algorithm: 'HS256',
  expiresIn: '12h',
  notBefore: '0',
  audience: `eAPD-${process.env.NODE_ENV}`,
  issuer: 'eAPD'
};

const getDefaultOptions = () => {
  return { ...defaultOptions };
};

const sign = (payload, options = defaultOptions) => {
  return jwt.sign(payload, getSecret(), options);
};

const verifyEAPDToken = token => {
  try {
    return jwt.verify(token, getSecret());
  } catch (err) {
    throw new Error('invalid Token');
  }
};

const exchangeToken = async (
  req,
  { extractor = jwtExtractor, verifier = verifyJWT, getUser = getUserByID } = {}
) => {
  const oktaJWT = extractor(req);
  // verify the token using the okta verifier.
  const claims = oktaJWT ? await verifyWebToken(oktaJWT, { verifier }) : false;
  if (!claims) return null;

  const { uid, ...additionalValues } = claims;
  const user = await getUser(uid, true, { additionalValues });
  console.log({ user });
  user.jwt = sign(user);

  return user;
};

const changeState = async (
  user,
  stateId,
  { populate = populateUserRole } = {}
) => {
  const populatedUser = await populate(user, stateId);

  return sign(populatedUser, {});
};

const verifyAndUpdateExpirations = async (
  claims,
  {
    getExpiredUserAffiliations_ = actualGetExpiredUserAffiliations,
    getAffiliatedStates_ = actualGetUserAffiliatedStates,
    updateAuthAffiliation_ = actualUpdateAuthAffiliation
  } = {}
) => {
  const expiredAffiliations = await getExpiredUserAffiliations_(claims.id);

  const updatedAffiliations = expiredAffiliations.map(async affiliation => {
    await updateAuthAffiliation_({
      affiliationId: affiliation.id,
      newRoleId: -1,
      newStatus: 'revoked',
      changedBy: 'system',
      stateId: affiliation.state_id,
      ffy: null
    });
  });

  await Promise.all(updatedAffiliations);

  // copy the token to prevent altering it
  const newClaims = JSON.parse(JSON.stringify(claims));
  const affiliations = await getAffiliatedStates_(claims.id);
  newClaims.states = affiliations;
  return newClaims;
};

const mockVerifyEAPDJWT = async token => {
  const user = await getUserByID(token, false);
  return user;
};

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    verifyWebToken,
    jwtExtractor,
    getDefaultOptions,
    sign,
    verifyEAPDToken: mockVerifyEAPDJWT,
    exchangeToken,
    actualVerifyEAPDToken: verifyEAPDToken,
    changeState,
    verifyAndUpdateExpirations
  };
} else {
  module.exports = {
    verifyWebToken,
    jwtExtractor,
    getDefaultOptions,
    sign,
    verifyEAPDToken,
    exchangeToken,
    changeState,
    verifyAndUpdateExpirations
  };
}
