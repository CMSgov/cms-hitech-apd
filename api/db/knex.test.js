import tap from 'tap';
import knex from './knex.js';

tap.test('database wrappers / oktaUsers', async dbTest => {
  // This test will NOT succeed unless there is a valid DB in scope.
  dbTest.skip('db select alaska from the database', async t => {
    const dbResponse = await knex('states')
      .select('*')
      .where({ id: 'na' })
      .first();

    t.same(dbResponse.id, 'na');
  });

  dbTest.teardown(async () => {
    await knex.destroy();
  });
});
