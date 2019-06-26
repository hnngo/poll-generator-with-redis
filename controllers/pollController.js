const _ = require('lodash');

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
exports.postCreatePoll = (req, res) => {
  const pollSettings = {};
  const { redisClient } = res.locals;
  const {
    question,
    numberOfOptions,
    optionContent,
    optionalStartingScores
  } = req.body;

  // Check requirement
  if (isNaN(numberOfOptions) || !question.length || optionContent.length <= 1) {
    console.log("Invalid polling information");
    return res.json({ message: "Invalid polling information" });
  } else if (!redisClient) {
    console.log("Cannot connect to Redis server");
    return res.json({ message: "Cannot connect to Redis server" });
  }

  pollSettings.question = question;
  pollSettings.numberOfOptions = numberOfOptions;
  pollSettings.optionContent = optionContent;

  // Optional Starting Scores
  if (optionalStartingScores) {
    //PENDING: Check fields
    pollSettings.startingScores = optionalStartingScores;
  } else {
    pollSettings.startingScores = new Array(numberOfOptions).fill(0);;
  }

  console.log(pollSettings);

  // 

  // Store in redis server
  const args = _.flatten(_.zip(pollSettings.startingScores, pollSettings.optionContent));
  args.unshift('question');

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
};
