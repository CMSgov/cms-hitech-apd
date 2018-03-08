const tap = require('tap');
const sinon = require('sinon');

const loggedInMiddleware = require('../../auth/middleware').loggedIn;
const canMiddleware = require('../../auth/middleware').can('edit-state');
const putEndpoint = require('./put');

tap.test('states PUT endpoints', async endpointTest => {
  const sandbox = sinon.createSandbox();
  const app = {
    put: sandbox.stub()
  };
  const dataHelper = {
    getFields: [],
    putFields: [
      'medicaid_office',
      'program_benefits',
      'program_vision',
      'state_pocs'
    ],
    getStateFromUserOrID: sandbox.stub()
  };
  const req = {
    params: { id: 'state-id' },
    user: { id: 'user-id' },
    body: {}
  };
  const res = {
    status: sandbox.stub(),
    send: sandbox.stub(),
    end: sandbox.stub()
  };

  endpointTest.beforeEach(async () => {
    sandbox.resetBehavior();
    sandbox.resetHistory();

    req.body = {};

    res.status.returns(res);
    res.send.returns(res);
    res.end.returns(res);
  });

  endpointTest.test('setup', async setupTest => {
    putEndpoint(app);

    setupTest.ok(
      app.put.calledWith('/states/:id', canMiddleware, sinon.match.func),
      'specific states PUT endpoint is registered'
    );
    setupTest.ok(
      app.put.calledWith('/states', loggedInMiddleware, sinon.match.func),
      'user-specific states PUT endpoint is registered'
    );
  });

  // Since both the specific-state and user-based handlers are the
  // same, we don't need as many tests.  🎉
  endpointTest.test('update state handler', async handlerTest => {
    let handler;
    handlerTest.beforeEach(async () => {
      putEndpoint(app, dataHelper);
      handler = app.put.args.find(args => args[0] === '/states')[2];
    });

    handlerTest.test(
      'sends a server error code if there is an database error',
      async invalidTest => {
        dataHelper.getStateFromUserOrID.rejects();

        await handler(req, res);

        invalidTest.ok(
          dataHelper.getStateFromUserOrID.calledWith('state-id', 'user-id'),
          'attempts to fetch the appropriate state'
        );
        invalidTest.ok(res.status.calledWith(500), 'HTTP status set to 500');
        invalidTest.ok(res.send.notCalled, 'no body is sent');
        invalidTest.ok(res.end.called, 'response is terminated');
      }
    );

    handlerTest.test(
      'sends a not-found error if the requested state does not exist',
      async invalidTest => {
        dataHelper.getStateFromUserOrID.resolves();

        await handler(req, res);

        invalidTest.ok(
          dataHelper.getStateFromUserOrID.calledWith('state-id', 'user-id'),
          'attempts to fetch the appropriate state'
        );
        invalidTest.ok(res.status.calledWith(404), 'HTTP status set to 404');
        invalidTest.ok(res.send.notCalled, 'no body is sent');
        invalidTest.ok(res.end.called, 'response is terminated');
      }
    );

    handlerTest.test(
      'sends an unauthorized error if the user does not have an associated state',
      async invalidTest => {
        dataHelper.getStateFromUserOrID.resolves({
          get: sinon.stub().returns()
        });

        await handler(req, res);

        invalidTest.ok(
          dataHelper.getStateFromUserOrID.calledWith('state-id', 'user-id'),
          'attempts to fetch the appropriate state'
        );
        invalidTest.ok(res.status.calledWith(401), 'HTTP status set to 401');
        invalidTest.ok(res.send.notCalled, 'no body is sent');
        invalidTest.ok(res.end.called, 'response is terminated');
      }
    );

    handlerTest.test(
      'when we can successfully get a state from the database...',
      async validStateTests => {
        const stateModel = {
          get: sinon.stub(),
          pick: sinon.stub(),
          set: sinon.stub(),
          save: sinon.stub()
        };
        validStateTests.beforeEach(async () => {
          stateModel.get.withArgs('id').returns(true);
          stateModel.pick.withArgs([]).returns({
            id: 'state id',
            medicaid_office: 'old Medicaid office',
            name: 'state name',
            program_benefits: 'old benefits',
            program_vision: 'old vision',
            state_pocs: 'old pocs'
          });

          dataHelper.getStateFromUserOrID.resolves(stateModel);
        });

        validStateTests.test(
          'sends a data validation error for invalid updates...',
          async invalidTests => {
            [
              {
                name: 'with an empty medicaid office',
                token: 'edit-state-invalid-medicaid-office',
                body: {
                  medicaid_office: {}
                }
              },
              {
                name: 'with a medicaid office with an invalid address',
                token: 'edit-state-invalid-medicaid-office',
                body: {
                  medicaid_office: {
                    address: 0xdeadbeef,
                    city: 'city',
                    zip: 'zip'
                  }
                }
              },
              {
                name: 'with a medicaid office with an invalid city',
                token: 'edit-state-invalid-medicaid-office',
                body: {
                  medicaid_office: {
                    address: 'address',
                    city: 0xdeadbeef,
                    zip: 'zip'
                  }
                }
              },
              {
                name: 'with a medicaid office with an invalid zip',
                token: 'edit-state-invalid-medicaid-office',
                body: {
                  medicaid_office: {
                    address: 'address',
                    city: 'city',
                    zip: 0xdeadbeef
                  }
                }
              },
              {
                name: 'with an invalid program benefits statement',
                token: 'edit-state-invalid-benefits',
                body: {
                  program_benefits: 0xdeadbeef
                }
              },
              {
                name: 'with an invalid program vision statement',
                token: 'edit-state-invalid-vision',
                body: {
                  program_vision: 0xdeadbeef
                }
              },
              {
                name: 'with points of contact with invalid name',
                token: 'edit-state-invalid-state-pocs',
                body: {
                  state_pocs: [
                    {
                      name: 0xdeadbeef,
                      email: 'em@il',
                      position: 'position'
                    }
                  ]
                }
              },
              {
                name: 'with points of contact with invalid email',
                token: 'edit-state-invalid-state-pocs',
                body: {
                  state_pocs: [
                    {
                      name: 'name',
                      email: 'email',
                      position: 'position'
                    }
                  ]
                }
              },
              {
                name: 'with points of contact with invalid position',
                token: 'edit-state-invalid-state-pocs',
                body: {
                  state_pocs: [
                    {
                      name: 'name',
                      email: 'em@il',
                      position: 0xdeadbeef
                    }
                  ]
                }
              }
            ].forEach(scenario => {
              invalidTests.test(scenario.name, async invalidTest => {
                req.body = scenario.body;

                await handler(req, res);

                invalidTest.ok(
                  res.status.calledWith(400),
                  'HTTP status set to 400'
                );
                invalidTest.ok(
                  res.send.calledWith({ error: scenario.token }),
                  'an error token is sent'
                );
                invalidTest.ok(res.end.called, 'response is terminated');
              });
            });
          }
        );

        validStateTests.test(
          'sends back a complete, updated object when the update is valid',
          async validTest => {
            req.body = {
              name: 'do not allow the state name to be changed...',
              program_benefits: 'new benefits goes here',
              propertyWeDoNotSupport: 'this gets stripped out'
            };

            await handler(req, res);

            validTest.ok(
              // Medicaid office and state POCs are always set - if they
              // are not passed as arguments, they are set to undefined.
              // If they're not set, bookshelf throws an error.
              stateModel.set.calledWith({
                program_benefits: 'new benefits goes here',
                medicaid_office: undefined,
                state_pocs: undefined
              }),
              'updates the model with only supported fields'
            );
            validTest.ok(
              stateModel.save.calledAfter(stateModel.set),
              'model is saved after it is updated'
            );
            validTest.ok(
              res.send.calledWith({
                id: 'state id',
                medicaid_office: 'old Medicaid office',
                name: 'state name',
                program_benefits: 'new benefits goes here',
                program_vision: 'old vision',
                state_pocs: 'old pocs'
              }),
              'sends back the updated state object'
            );
          }
        );
      }
    );
  });
});
