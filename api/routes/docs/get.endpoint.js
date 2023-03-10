import {
  getDB,
  setupDB,
  teardownDB,
  login
} from '../../endpoint-tests/utils.js';

describe('Document endpoints', () => {
  const db = getDB();
  const controller = new AbortController();
  let api;
  beforeAll(async () => {
    api = login(null, controller);
    await setupDB(db);
  });
  afterAll(async () => {
    await teardownDB(db);
    controller.abort();
  });

  describe('Get help doc | GET /docs/account-registration', () => {
    const url = '/docs/account-registration';

    it('when authenticated', async () => {
      const response = await api.get(url);

      expect(response.status).toEqual(200);
      expect(response.data).toMatchSnapshot();
    });

    it('when not authenticated', async () => {
      const response = await api.get(url);

      expect(response.status).toEqual(200);
      expect(response.data).toMatchSnapshot();
    });
  });

  describe('Get help doc | GET /docs/system-access', () => {
    const url = '/docs/system-access';

    it('when authenticated', async () => {
      const response = await api.get(url);

      expect(response.status).toEqual(200);
      expect(response.data).toMatchSnapshot();
    });

    it('when not authenticated', async () => {
      const response = await api.get(url);

      expect(response.status).toEqual(200);
      expect(response.data).toMatchSnapshot();
    });
  });
});
