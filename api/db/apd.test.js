const tap = require('tap');
const sinon = require('sinon');

const apd = require('./apd')();

tap.test('apd data model', async apdModelTests => {
  apdModelTests.test('setup', async setupTests => {
    setupTests.match(
      apd,
      {
        apd: {
          tableName: 'apds',
          format: Function,
          toJSON: Function,
          static: {
            updateableFields: [
              'status',
              'period',
              'programOverview',
              'narrativeHIE',
              'narrativeHIT',
              'narrativeMMIS'
            ],
            foreignKey: 'apd_id',
            owns: { activities: 'apdActivity' },
            withRelated: [
              { activities: Function },
              'activities.approaches',
              'activities.contractorResources',
              'activities.contractorResources.years',
              'activities.goals',
              'activities.expenses',
              'activities.expenses.entries',
              'activities.schedule',
              'activities.statePersonnel',
              'activities.statePersonnel.years'
            ]
          }
        }
      },
      'get the expected model definitions'
    );

    setupTests.type(
      apd.apd.activities,
      'function',
      'creates an activities relationship for the apd model'
    );

    setupTests.type(
      apd.apd.state,
      'function',
      'creates a state relationship for the apd model'
    );
  });

  apdModelTests.test('with-related fields order themselves', async test => {
    const query = { orderBy: sinon.stub() };
    const withRelated = apd.apd.static.withRelated;

    withRelated.filter(w => typeof w === 'object').forEach(related => {
      Object.keys(related).forEach(relation => {
        related[relation](query);
        test.ok(query.orderBy.calledWith('id'), `${relation} is ordered by ID`);
        query.orderBy.resetHistory();
      });
    });
  });

  apdModelTests.test(
    'apd model sets up activities relationship',
    async activitiesTests => {
      const self = {
        hasMany: sinon.stub().returns('florp')
      };

      const output = apd.apd.activities.bind(self)();

      activitiesTests.ok(
        self.hasMany.calledWith('apdActivity'),
        'sets up the relationship mapping to activities'
      );
      activitiesTests.equal(output, 'florp', 'returns the expected value');
    }
  );

  apdModelTests.test(
    'apd model sets up state relationship',
    async stateTests => {
      const self = {
        belongsTo: sinon.stub().returns('beep')
      };

      const output = apd.apd.state.bind(self)();

      stateTests.ok(
        self.belongsTo.calledWith('state'),
        'sets up the relationship mapping to a state'
      );
      stateTests.equal(output, 'beep', 'returns the expected value');
    }
  );

  apdModelTests.test('converts from camel case to snake case', async test => {
    const attributes = {
      fine: 'no change',
      good: 'also no change',
      programOverview: 'changed over',
      narrativeHIE: undefined,
      narrativeHIT: null,
      narrativeMMIS: 'also changed'
    };

    const out = apd.apd.format(attributes);

    test.same(
      out,
      {
        fine: 'no change',
        good: 'also no change',
        program_overview: 'changed over',
        narrative_hit: null,
        narrative_mmis: 'also changed'
      },
      'converts to snake case, if defined'
    );
  });

  apdModelTests.test('converts to JSON', async test => {
    const self = {
      get: sinon.stub(),
      related: sinon
        .stub()
        .withArgs('activities')
        .returns({ toJSON: sinon.stub().returns('apd-activities') })
    };
    self.get.withArgs('id').returns('apd-id');
    self.get.withArgs('state_id').returns('apd-state');
    self.get.withArgs('status').returns('apd-status');
    self.get.withArgs('period').returns('apd-period');
    self.get.withArgs('program_overview').returns('apd-overview');
    self.get.withArgs('narrative_hie').returns('apd-hie');
    self.get.withArgs('narrative_hit').returns('apd-hit');
    self.get.withArgs('narrative_mmis').returns('apd-mmis');

    const output = apd.apd.toJSON.bind(self)();

    test.same(
      output,
      {
        id: 'apd-id',
        state: 'apd-state',
        status: 'apd-status',
        period: 'apd-period',
        programOverview: 'apd-overview',
        narrativeHIE: 'apd-hie',
        narrativeHIT: 'apd-hit',
        narrativeMMIS: 'apd-mmis',
        activities: 'apd-activities'
      },
      'gives the expected JSON'
    );
  });
});
