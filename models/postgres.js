const { Pool, Client } = require('pg');
const connectionString = 'postgresql://polladmin:password@localhost:5432/pollredis';

// Create new Pool
const pool = new Pool({ connectionString });


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
});


pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
});


// const postgresClient = new Client({ connectionString })
// postgresClient.connect()

// postgresClient.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   postgresClient.end()
// });
