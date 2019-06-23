const express = require("express");
const redis = require('redis');
const redisClient = redis.createClient();
const pollingRoutes = require('./routes/pollingRoutes');
const { Pool, Client } = require('pg');

const connectionString = 'postgresql://me:password@localhost:5432/pollredis';
const pool = new Pool({connectionString})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const postgresClient = new Client({connectionString})
postgresClient.connect()

postgresClient.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  postgresClient.end()
})

// Create express app
const app = express();
const server = require('http').createServer(app);

// Redis setup
redisClient.on('connect', () => {
  // Clear old memories
  redisClient.flushall();
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.log('Redis client cannot connect ' + err);
});

// Socketio setuo
require('./services/socketio')(server);

// Express middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express init routes
app.use('/polling', (req, res, next) => {
  // Passing redis client through middlewares
  res.locals.redisClient = client;
  next();
}, pollingRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Node app listening on http://localhost:${port}`);
});
