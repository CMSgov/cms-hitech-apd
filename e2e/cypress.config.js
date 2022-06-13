const { defineConfig } = require('cypress'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = defineConfig({
  e2e: {
    projectId: 'j7o2hw',
    baseUrl: 'http://localhost:8080/',
    viewportWidth: 1000,
    viewportHeight: 1000,
    defaultCommandTimeout: 36000,
    videoUploadOnPasses: false,
    numTestsKeptInMemory: 0,
    env: {
      'cypress-react-selector': {
        root: '#app'
      },
      API: 'http://localhost:8081',
      fedadmin: 'fedadmin',
      fedadmin_pw: '',
      stateadmin: 'stateadmin',
      stateadmin_pw: '',
      statestaff: 'statestaff',
      statestaff_pw: '',
      statecontractor: 'statecontractor',
      statecontractor_pw: '',
      sysadmin: 'sysadmin',
      sysadmin_pw: '',
      requestedrole: 'requestedrole',
      requestedrole_pw: '',
      deniedrole: 'deniedrole',
      deniedrole_pw: '',
      revokedrole: 'revokedrole',
      revokedrole_pw: '',
      lockedout: 'lockedout',
      lockedout_pw: '',
      expired: 'expired',
      expired_pw: '',
      norole: 'norole',
      norole_pw: '',
      resetmfa: 'resetmfa',
      resetmfa_pw: '',
      lockedoutmfa: 'lockedoutmfa'
    },
    retries: {
      runMode: 1,
      openMode: 1
    }
  }
});
