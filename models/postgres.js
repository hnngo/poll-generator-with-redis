const { Pool, Client } = require('pg');
const connectionString = 'postgresql://polladmin:password@localhost:5432/pollredis';

// Create new Pool
const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (!err) console.log("Connected to pollredis database from user polladmin");
});

module.exports = {
  // Constants
  userTable: {
    TBL_NAME: "users",
    ATTR_USERID: "userid",
    ATTR_EMAIL: "email",
    ATTR_NAME: "name",
    ATTR_PASSWORD: "password",
  },

  // Functions
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
