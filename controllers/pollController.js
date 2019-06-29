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

const POLL_ALL_RELATED_ATTR = `${POLL_POLLID}, ${POLL_TABLE}.${POLL_USERID}, ${POLL_QUESTION}, ${POLL_OPTIONS}, ${POLL_DATE_CREATED}, ${POLL_LAST_UPDATED}, ${USER_NAME}, ${USER_EMAIL}`;

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
exports.postCreatePoll = async (req, res) => {
  const { redisClient } = res.locals;
  const { user_id } = req.session.auth;
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
    pollSettings.startingScores = new Array(options.length).fill(0);
  }

  try {
    // Store in postgres
    const { rows } = await db.query(
      `INSERT INTO ${POLL_TABLE} (${POLL_USERID}, ${POLL_QUESTION}, ${POLL_OPTIONS}) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, pollSettings.question, pollSettings.options]
    );

    // Store in redis server
    const redisPollName = 'poll-' + rows[0][POLL_POLLID];
    const opt_index = Array.apply(null, { length: rows[0][POLL_OPTIONS].length }).map(Number.call, Number);
    const args = _.flatten(_.zip(pollSettings.startingScores, opt_index));
    args.unshift(redisPollName);

    redisClient.exists(redisPollName, (isExisted) => {
      if (!isExisted) {
        redisClient.zadd(args, (err) => {
          if (err) throw err;
        });
      }
    });

    acLog(`User id ${rows[0][POLL_USERID]} created successfully poll id ${rows[0][POLL_POLLID]}`);
    return res.send(rows[0]);
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};

//  @METHOD   GET
//  @PATH     /pollser/all      
//  @DESC     Get all current poll
//  @QUERY    user_id     Get all poll of a user
exports.getAllPoll = async (req, res) => {
  const {
    user_id
  } = req.query;

  try {
    let dbQueryStr = `
    SELECT ${POLL_ALL_RELATED_ATTR}
    FROM ${POLL_TABLE}
    INNER JOIN ${USER_TABLE}
    ON ${POLL_TABLE}.${POLL_USERID} = ${USER_TABLE}.${USER_USERID}`;

    if (user_id) {
      dbQueryStr += ` WHERE ${USER_TABLE}.${USER_USERID} = '${user_id}';`;
    } else {
      dbQueryStr += ';';
    }

    const { rows } = await db.query(dbQueryStr);
    return res.send(rows);
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
}

//  @METHOD   GET
//  @PATH     /pollser/:pollid      
//  @DESC     Get poll by poll id
exports.getPollById = async (req, res) => {
  const { pollid } = req.params;

  if (!pollid) {
    acLog("Missing information");
    return res.json({ message: "Missing information" });
  }

  //PENDING: Fetch all poll if vote publicly by anonymous
  try {
    const { rows } = await db.query(`
    SELECT ${POLL_ALL_RELATED_ATTR}
    FROM ${POLL_TABLE}
    INNER JOIN ${USER_TABLE}
    ON ${POLL_TABLE}.${POLL_USERID} = ${USER_TABLE}.${USER_USERID}
    WHERE ${POLL_POLLID} = $1;`,
      [pollid]);

    return res.send(rows[0]);
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
}

//  @METHOD   GET
//  @PATH     /vote/:pollid
//  @DESC     Vote for a poll
//  @QUERY    user_id     Vote by a user identity
//            ans_index   Index of choice(s)
exports.getVotePoll = (req, res) => {
  const { pollid } = req.params;
  const { user_id, ans_index } = req.query;
  const { redisClient } = res.locals

  if (!pollid || !user_id || !ans_index) {
    acLog("Missing information");
    return res.json({ message: "Missing information" });
  }

  //PENDING: Check public poll and private poll here

  // Write to redis db
  const redisPollName = 'poll-' + pollid;
  const redisUpdateName = 'update-' + pollid;
  const ans_arr = ans_index.split(',');

  ans_arr.forEach((a) => {
    const args = [redisPollName, "1", a];
    redisClient.zincrby(args, (err) => {
      if (err) throw err;
    });
  })

  // Create the update key for poll
  // update-[poll_id] '{ user_id1: [0], user_id2: [0, 1] }'
  redisClient.get(redisUpdateName, (err, data) => {
    if (err) throw err;

    // If not exist, create and store in redis
    if (!data) {
      let updatedData = {};
      updatedData[user_id] = ans_arr;
      redisClient.set(redisUpdateName, JSON.stringify(updatedData));
      return;
    }

    let updatedData = JSON.parse(data);
    updatedData[user_id] = ans_arr;
    redisClient.set(redisUpdateName, JSON.stringify(updatedData));
    return;
  });
};

//  @METHOD   DELETE
//  @PATH     /pollser/:pollid      
//  @DESC     Delete a poll
exports.deletePollById = async (req, res) => {
  const { pollid } = req.params;

  try {
    await db.query(
      `DELETE FROM ${POLL_TABLE} WHERE ${POLL_POLLID} = $1`,
      [pollid]
    );
    return res.send();
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
}
