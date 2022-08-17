const tap = require('tap');
const sinon = require('sinon');
const patchEndpoint = require('./patch');

const mockExpress = require('../../util/mockExpress');
const mockResponse = require('../../util/mockResponse');

let app;
let res;
let next;


tap.test('apds/budget PATCH endpoint', async endpointTest => {
  endpointTest.beforeEach(async () => {
    app = mockExpress();
    res = mockResponse();
    next = sinon.stub();
  });

  endpointTest.test('setup', async setupTest => {
    getEndpoint(app);

    setupTest.ok(
      app.patch.calledWith('/apds/budget', sinon.match.func),
      'apds/budget PATCH endpoint is registered'
    );
  });

  endpointTest.test('patch apds/budget handler', async tests => {
    let handler;

    tests.beforeEach(async () => {
      patchEndpoint(app, { });
      handler = app.patch.args.find(
        args => args[0] === '/apds/budget'
      ).pop();
    });

    tests.test('basic handler test', async test => {
        const req = {}
        await handler(req, res, next);
        test.ok(res.send.calledWith({result: 'success'}))
    })

  });



});
