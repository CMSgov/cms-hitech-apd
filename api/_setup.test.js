const tap = require('tap');

// The purpose of this file is to ensure all relevant
// source files are imported so we get accurate
// coverage metrics. Without that, we only get
// coverage metric of sources that are imported
// during tests, which means we could easily forget
// to write tests for a new file and our automated
// tools wouldn't warn us.

require('./env');

require('./db');
require('./db/authorization');
require('./db/user');

require('./auth');
require('./auth/authenticate');
require('./auth/middleware');
require('./auth/serialization');
require('./auth/session');

require('./routes');
require('./routes/roles');
require('./routes/roles/get');
require('./routes/roles/post');
require('./routes/roles/put');
require('./routes/states');
require('./routes/states/put');
require('./routes/users');
require('./routes/users/get');
require('./routes/users/post');
require('./routes/logForm');

// fin

tap.pass('woohoo!');
