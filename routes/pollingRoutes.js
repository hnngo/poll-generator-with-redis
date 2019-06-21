const express = require('express');
const router = express.Router();
const _ = require('lodash');

//  @METHOD   POST
//  @PATH     /polling/start      
//  @DESC     Start the polling with predefined setting
router.post('/start', (req, res) => {
  const pollingSettings = {};
  const { redisClient } = res.locals;
  const {
    numberOfSlections,
    optionalNames,
    optionalStartingScores
  } = req.body;

  // Check requirement
  if (!numberOfSlections || isNaN(numberOfSlections)) {
    console.log("Invalid number of selections input");
    return res.json({ message: "Invalid number of selections input" });
  } else if (!redisClient) {
    console.log("Cannot connect to Redis server");
    return res.json({ message: "Cannot connect to Redis server" });
  }
  pollingSettings.numberOfSlections = numberOfSlections;

  // Optional Names for selections
  if (optionalNames) {
    //PENDING: Check fields
    pollingSettings.names = optionalNames;
  } else {
    pollingSettings.names = [];
    for (let i = 0; i < +numberOfSlections; i++) {
      pollingSettings.selectnamesionNames.push("Client " + (i + 1));
    }
  }

  // Optional Starting Scores
  if (optionalStartingScores) {
    //PENDING: Check fields
    pollingSettings.startingScores = optionalStartingScores;
  } else {
    pollingSettings.startingScores = new Array(numberOfSlections).fill(0);;
  }

  // Create set
  const args = _.flatten(_.zip(pollingSettings.startingScores, pollingSettings.names));
  args.unshift('leaderboard');

  // Add to redis
  redisClient.zadd(args, function (err, response) {
    if (err) throw err;
    console.log('Added ' + response + ' items.');

    // -Infinity and +Infinity also work
    var args1 = ['leaderboard', '+inf', '-inf', 'WITHSCORES'];
    redisClient.zrevrangebyscore(args1, function (err, response) {
      if (err) throw err;
      console.log('example1', response);

      res.send(response)
      // write your code here
    });

    // var max = 3, min = 1, offset = 1, count = 2;
    // var args2 = ['leaderboard', max, min, 'WITHSCORES', 'LIMIT', offset, count];
    // redisClient.zrevrangebyscore(args2, function (err, response) {
    //   if (err) throw err;
    //   console.log('example2', response);
    //   // write your code here
    // });
  });
})

module.exports = router;