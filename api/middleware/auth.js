const logger = require('../logger')('auth middleware');

const canCache = {};

const loggedIn = (req, res, next) => {
  logger.silly(req, 'got a loggedIn middleware request');
  if (req.user) {
    logger.verbose(req, `user is logged in`);
    next();
  } else {
    logger.info(req, 'user is not logged in');
    res.status(403).end();
  }
};

module.exports.loggedIn = loggedIn;

const canCreator = activity => {
  if (!canCache[activity]) {
    logger.silly(`can[${activity}] cache miss`);

    const can = (req, res, next) => {
      logger.silly(req, `got a can middleware request for [${activity}]`);
      // First check if they're logged in
      module.exports.loggedIn(req, res, () => {
        // Then check if they have the activity
        if (req.user.activities.includes(activity)) {
          logger.verbose(req, `user has the [${activity}] activity`);
          next();
        } else {
          logger.info(req, `user does not have the [${activity}] activity`);
          res.status(401).end();
        }
      });
    };
    canCache[activity] = can;
    logger.silly(`added handler for [${activity}] can middleware`);
  }
  return canCache[activity];
};

module.exports = { loggedIn, can: canCreator };
