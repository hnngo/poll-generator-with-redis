const { Pool } = require('pg');
const acLog = require('../utils/acLog');
const connectionString = 'postgresql://polladmin:password@localhost:5432/pollredis';

// Create new Pool
const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (!err) acLog("Connected to pollredis database from user polladmin");
});

module.exports = {
  // Constants
  userTable: {
    TBL_NAME: "users",
    ATTR_USERID: "user_id",
    ATTR_EMAIL: "email",
    ATTR_NAME: "name",
    ATTR_PASSWORD: "password",
  },

  // Functions
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
