const _ = require('lodash');
const acLog = require('../utils/acLog');
const db = require('../models/postgres');

const {
  TBL_NAME: USER_TABLE,
  ATTR_EMAIL: USER_EMAIL,
  ATTR_NAME: USER_NAME,
  ATTR_PASSWORD: USER_PASSWORD,
  ATTR_USERID: USER_USERID
} = db.userTable;

const {
  TBL_NAME: POLL_TABLE,
  ATTR_POLLID: POLL_POLLID,
  ATTR_USERID: POLL_USERID,   
  ATTR_QUESTION: POLL_QUESTION,
  ATTR_OPTIONS: POLL_OPTIONS,
  ATTR_DATE_CREATED: POLL_DATE_CREATED,
  ATTR_LAST_UPDATED: POLL_LAST_UPDATED
} = db.pollTable;

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
exports.postCreatePoll = (req, res) => {
  const { redisClient } = res.locals;
  const { userid } = req.session.auth;
  const {
    question,
    options,
    optionalStartingScores
  } = req.body;

  // Check requirement
  if (!question.length || options.length <= 1) {
    console.log("Invalid polling information");
    return res.json({ message: "Invalid polling information" });
  } else if (!redisClient) {
    console.log("Cannot connect to Redis server");
    return res.json({ message: "Cannot connect to Redis server" });
  }

  // Init poll setting
  const pollSettings = {};
  pollSettings.question = question;
  pollSettings.options = options;

  // Optional Starting Scores
  if (optionalStartingScores) {
    //PENDING: Check fields
    pollSettings.startingScores = optionalStartingScores;
  } else {
    pollSettings.startingScores = new Array(question.length).fill(0);;
  }

  console.log(pollSettings);
  console.log(userid);

  // Store in postgres
  db.query(
    `INSERT INTO ${POLL_TABLE} (${POLL_USERID}, ${POLL_QUESTION}, ${POLL_OPTIONS}) VALUES ($1, $2, $3) RETURNING *`,
    [userid, pollSettings.question, pollSettings.options],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }

      acLog(result.rows[0]);
      return res.send(result.rows[0]);
    }
  )

  // Store in redis server
  // const args = _.flatten(_.zip(pollSettings.startingScores, pollSettings.options));
  // args.unshift('question');

  // Add to redis
  // redisClient.zadd(args, function (err, response) {
  //   if (err) throw err;
  //   console.log('Added ' + response + ' items.');

  //   // -Infinity and +Infinity also work
  //   var args1 = ['leaderboard', '+inf', '-inf', 'WITHSCORES'];
  //   redisClient.zrevrangebyscore(args1, function (err, response) {
  //     if (err) throw err;
  //     console.log('example1', response);

  //     res.send(response)
  //     // write your code here
  //   });

  //   // var max = 3, min = 1, offset = 1, count = 2;
  //   // var args2 = ['leaderboard', max, min, 'WITHSCORES', 'LIMIT', offset, count];
  //   // redisClient.zrevrangebyscore(args2, function (err, response) {
  //   //   if (err) throw err;
  //   //   console.log('example2', response);
  //   //   // write your code here
  //   // });
  // });
};

//  @METHOD   GET
//  @PATH     /pollser/all      
//  @DESC     Get all current poll
exports.getAllPoll = (req, res) => {
  db.query(
    `SELECT * FROM ${POLL_TABLE}`,
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }

      return res.send(result.rows);
    }
  )
}

//  @METHOD   GET
//  @PATH     /pollser/:pollid      
//  @DESC     Get poll by poll id
exports.getPollById = (req, res) => {
  const { pollid } = req.params;

  if (!pollid) {
    acLog("Missing information");
    return res.json({ message: "Missing information" });
  } 

  db.query(
    `SELECT * FROM ${POLL_TABLE} WHERE ${POLL_POLLID} = $1`,
    [pollid],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }
      
      return res.send(result.rows[0]);
    }
  )
}