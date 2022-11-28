import swaggerUi from 'swagger-ui-express';
import loggerFactory from '../logger';
import affiliations from './affiliations/index';
import apds from './apds/index';
// import apdsEvents from './apds/events';
// import apdsFiles from './apds/files';
import auth from './auth/index';
import docs from './docs/index';
import roles from './roles/index';
import states from './states/index';
// import stateAffiliations from './states/affilitations';
import users from './users/index';
import openAPI from './openAPI/index';

const logger = loggerFactory('routes index');

// ############### ROUTE IMPORT INSERTION POINT #######################
export default (
  app,
  {
    affiliationsEndpoint = affiliations,
    apdsEndpoint = apds,
    // apdsEventsEndpoint = apdsEvents,
    // apdsFilesEndpoint = apdsFiles,
    authEndpoint = auth,
    docsEndpoint = docs,
    rolesEndpoint = roles,
    statesEndpoint = states,
    // stateAffiliationEndpoint = stateAffiliations,
    usersEndpoint = users,
    openAPIdoc = openAPI
  } = {}
) => {
  logger.debug('setting up routes for affiliations');
  affiliationsEndpoint(app);
  logger.debug('setting up routes for apds');
  apdsEndpoint(app);
  // logger.debug('setting up routes for apds/events');
  // apdsEventsEndpoint(app);
  // logger.debug('setting up routes for apds/files');
  // apdsFilesEndpoint(app);
  logger.debug('setting up routes for auth');
  authEndpoint(app);
  logger.debug('setting up routes for docs');
  docsEndpoint(app);
  logger.debug('setting up routes for roles');
  rolesEndpoint(app);
  logger.debug('setting up routes for states');
  statesEndpoint(app);
  // logger.debug('setting up routes for states/affiliation');
  // stateAffiliationEndpoint(app);
  logger.debug('setting up routes for users');
  usersEndpoint(app);

  // ############### ROUTE REGISTRATION INSERTION POINT #######################
  logger.debug('setting up route for OpenAPI');

  app.get('/open-api', (req, res) => {
    logger.verbose({ id: req.id, message: 'sending OpenAPI documentation' });
    res.send(openAPIdoc);
  });

  logger.debug('setting out route for API docs');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIdoc));
};
