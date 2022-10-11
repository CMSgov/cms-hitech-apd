const tap = require('tap');
const { calculateBudget } = require('@cms-eapd/common');
// const toMongodb = require('jsonpatch-to-mongodb');

const { setup, teardown } = require('../db/mongodb');
const { APD, Budget } = require('./index');
const { apd, apdNoActivities } = require('../seeds/development/apds');

let apdId;
let budgetId;

tap.test('Budget model test', async t => {
  t.before(async () => {
    await setup();
  });

  t.beforeEach(async () => {
    const budget = await Budget.create(calculateBudget(apd));
    // eslint-disable-next-line no-underscore-dangle
    budgetId = budget._id.toString();

    const { _id: apdObjId } = await APD.create({
      status: 'draft',
      stateId: 'md',
      ...apd,
      budget
    });
    apdId = apdObjId.toString();
  });

  t.test('get Budget from APD', async test => {
    const found = await APD.findOne({ _id: apdId });

    test.ok(!!found.budget, 'Found the Budget that was just added to the APD');
    // eslint-disable-next-line no-underscore-dangle
    test.equal(found.budget.toString(), budgetId, 'Budget Id was retrieved');
  });

  t.test('get populated Budget from APD', async test => {
    const found = await APD.findOne({ _id: apdId }).populate('budget');

    test.ok(!!found.budget, 'Found the Budget that was just added to the APD');
    // eslint-disable-next-line no-underscore-dangle
    test.equal(found.budget._id.toString(), budgetId, 'Budget was retrieved');
  });

  t.test('recalculate budget', async test => {
    const newBudget = calculateBudget(apdNoActivities);

    await Budget.updateOne({ _id: budgetId }, newBudget);
    const updatedBudget = await Budget.findOne({ _id: budgetId }).lean();
    delete updatedBudget._id; // eslint-disable-line no-underscore-dangle
    delete updatedBudget.__v; // eslint-disable-line no-underscore-dangle

    test.same(updatedBudget, newBudget, 'Budget was patched');
  });

  t.afterEach(async () => {
    await APD.deleteOne({ _id: apdId });
    await Budget.deleteOne({ _id: budgetId });
  });

  t.teardown(async () => {
    await teardown();
  });
});
