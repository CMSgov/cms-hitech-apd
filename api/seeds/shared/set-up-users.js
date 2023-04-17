import { AFFILIATION_STATUSES } from '@cms-eapd/common';
import { format } from 'date-fns';
import loggerFactory from '../../logger/index.js';

const logger = loggerFactory('user seeder');

const { REQUESTED, APPROVED, DENIED, REVOKED } = AFFILIATION_STATUSES;

const today = new Date();

const currentFfy = (() => {
  const year = new Date().getFullYear();

  // Federal fiscal year starts October 1,
  // but Javascript months start with 0 for
  // some reason, so October is month 9.
  if (new Date().getMonth() > 8) {
    return year + 1;
  }
  return year;
})();

const PostgresDateFormat = 'yyyy-MM-dd HH:mm:ss';

const formatOktaUser = oktaResult => {
  const { email, displayName, login } = oktaResult.profile;
  return {
    user_id: oktaResult.id,
    email,
    displayName,
    login
  };
};

const createUsersToAdd = async (knex, oktaClient) => {
  logger.info('Retrieving user ids from Okta');
  const regularUser = (await oktaClient.getUser('em@il.com')) || {};
  const fedAdmin = (await oktaClient.getUser('fedadmin')) || {};
  const stateAdmin = (await oktaClient.getUser('stateadmin')) || {};
  const stateStaff = (await oktaClient.getUser('statestaff')) || {};
  const stateContractor = (await oktaClient.getUser('statecontractor')) || {};
  const resetmfa = (await oktaClient.getUser('resetmfa')) || {};
  const requestedRole = (await oktaClient.getUser('requestedrole')) || {};
  const deniedRole = (await oktaClient.getUser('deniedrole')) || {};
  const revokedRole = (await oktaClient.getUser('revokedrole')) || {};

  logger.info('Retrieving role ids from database');
  const fedAdminRoleId = await knex('auth_roles')
    .where({ name: 'eAPD Federal Admin' })
    .first()
    .then(role => role.id);
  const stateAdminRoleId = await knex('auth_roles')
    .where({ name: 'eAPD State Admin' })
    .first()
    .then(role => role.id);
  const stateStaffRoleId = await knex('auth_roles')
    .where({ name: 'eAPD State Staff' })
    .first()
    .then(role => role.id);
  const stateContractorRoleId = await knex('auth_roles')
    .where({ name: 'eAPD State Contractor' })
    .first()
    .then(role => role.id);

  logger.info('Setting up affiliations and certifications to add');
  const oktaAffiliations = [];
  const stateCertifications = [];
  const oktaUsers = [];

  if (regularUser) {
    oktaAffiliations.push({
      user_id: regularUser.id,
      state_id: 'na',
      role_id: stateAdminRoleId,
      status: APPROVED,
      username: 'em@il.com',
      expires_at: format(
        new Date(new Date().getFullYear() + 1, '06', '30'),
        PostgresDateFormat
      )
    });
    oktaUsers.push(formatOktaUser(regularUser));
  }
  if (fedAdmin) {
    oktaAffiliations.push({
      user_id: fedAdmin.id,
      state_id: 'fd',
      role_id: fedAdminRoleId,
      status: APPROVED,
      username: fedAdmin.profile.login
    });
    oktaUsers.push(formatOktaUser(fedAdmin));
  }
  if (stateAdmin) {
    oktaAffiliations.push({
      id: 1001, // manually set id for testing
      user_id: stateAdmin.id,
      state_id: 'na',
      role_id: stateStaffRoleId,
      status: APPROVED,
      username: stateAdmin.profile.login,
      expires_at: format(
        new Date(new Date().getFullYear() + 1, '06', '30'),
        PostgresDateFormat
      )
    });
    // Let them be a staffer in Maryland too
    oktaAffiliations.push({
      user_id: stateAdmin.id,
      state_id: 'md',
      role_id: stateStaffRoleId,
      status: APPROVED,
      expires_at: format(
        new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
        PostgresDateFormat
      ),
      username: stateAdmin.profile.login
    });
    // Add a valid certification and this user will remain an admin
    stateCertifications.push({
      id: 1002, // manually set id for testing
      ffy: currentFfy,
      name: `${stateAdmin.profile.firstName} ${stateAdmin.profile.lastName}`,
      state: 'na',
      email: stateAdmin.profile.email,
      uploadedBy: fedAdmin.id,
      uploadedOn: new Date(),
      fileUrl:
        'http://localhost:8081/auth/certifications/files/eAPDSystemAccess.pdf',
      affiliationId: null,
      status: 'active'
    });

    stateCertifications.push({
      ffy: currentFfy,
      name: `${stateAdmin.profile.firstName} ${stateAdmin.profile.lastName}`,
      state: 'tn',
      email: stateAdmin.profile.email,
      uploadedBy: fedAdmin.id,
      uploadedOn: new Date(),
      fileUrl:
        'http://localhost:8081/auth/certifications/files/eAPDSystemAccess.pdf',
      affiliationId: null,
      status: 'active'
    });
    oktaUsers.push(formatOktaUser(stateAdmin));
  }

  if (stateStaff) {
    oktaAffiliations.push({
      user_id: stateStaff.id,
      state_id: 'na',
      role_id: stateStaffRoleId,
      status: APPROVED,
      username: stateStaff.profile.login
    });
    oktaUsers.push(formatOktaUser(stateStaff));
  }
  if (stateContractor) {
    oktaAffiliations.push({
      user_id: stateContractor.id,
      state_id: 'na',
      role_id: stateContractorRoleId,
      status: APPROVED,
      username: stateContractor.profile.login
    });
    oktaUsers.push(formatOktaUser(stateContractor));
  }

  if (resetmfa) {
    oktaAffiliations.push({
      user_id: resetmfa.id,
      state_id: 'na',
      role_id: stateStaffRoleId,
      status: APPROVED,
      username: resetmfa.profile.login
    });
    oktaUsers.push(formatOktaUser(resetmfa));
  }

  if (requestedRole) {
    oktaAffiliations.push({
      user_id: requestedRole.id,
      state_id: 'na',
      status: REQUESTED,
      username: requestedRole.profile.login
    });

    oktaUsers.push(formatOktaUser(requestedRole));
  }
  if (deniedRole) {
    oktaAffiliations.push({
      user_id: deniedRole.id,
      state_id: 'na',
      status: DENIED,
      username: deniedRole.profile.login
    });
    oktaUsers.push(formatOktaUser(deniedRole));
  }
  if (revokedRole) {
    oktaAffiliations.push({
      user_id: revokedRole.id,
      state_id: 'na',
      status: REVOKED,
      username: revokedRole.profile.login
    });

    oktaUsers.push(formatOktaUser(revokedRole));
  }
  return { oktaAffiliations, stateCertifications, oktaUsers };
};

export default createUsersToAdd;
