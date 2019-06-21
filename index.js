const express = require("express");
const redis = require('redis');
const client = redis.createClient();
const pollingRoutes = require('./routes/pollingRoutes');

// Create express app
const app = express();
const server = require('http').createServer(app);

// Redis setup
client.on('connect', () => {
  // Clear old memories
  client.flushall();
  console.log('Redis client connected');
});

client.on('error', (err) => {
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
