const redis = require('redis');
const redisClient = redis.createClient();
const redisSync = require('./redisSync');
const acLog = require('../../utils/acLog');

// Redis connection init
redisClient.on('connect', () => {
  // Clear old memories
  redisClient.flushall();
  acLog('Redis client connected');
});

redisClient.on('error', (err) => {
  acLog('Redis client cannot connect ' + err);
});

redisSync(redisClient);

exports.redisClient = redisClient;
