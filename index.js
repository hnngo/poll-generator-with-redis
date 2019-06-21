const express = require("express");
const redis = require('redis');
const client = redis.createClient();
const pollingRoutes = require('./routes/pollingRoutes');

// Create express app
const app = express();

// Redis setup
client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (err) => {
  console.log('Redis client cannot connect ' + err);
});

// Express middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express init routes
app.use('/polling', (req, res, next) => {
  // Passing redis client through middlewares
  res.locals.client = client;
  next();
}, pollingRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Node app listening on http://localhost:${port}`);
});
