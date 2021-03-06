const _ = require('lodash');
const { acLog } = require('../utils/helpFuncs');
const db = require('../models/postgres');
const redis = require('redis');
const publisher = redis.createClient();
const { redisClient } = require('../services/redis/redisClient');
const { uuidV4, sleep } = require('../utils/helpFuncs');

const LIMIT_PER_PAGE = 100;

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
  ATTR_PRIVATE: POLL_PRIVATE,
  ATTR_MULTIPLE_CHOICE: POLL_MULTIPLE_CHOICE,
  ATTR_DATE_CREATED: POLL_DATE_CREATED,
  ATTR_LAST_UPDATED: POLL_LAST_UPDATED
} = db.pollTable;

const {
  TBL_NAME: POLLANS_TABLE,
  ATTR_POLLANS_ID: POLLANS_ID,
  ATTR_POLLID: POLLANS_POLLID,
  ATTR_USERID: POLLANS_USERID,
  ATTR_ANSWER_INDEX: POLLANS_INDEX,
  ATTR_ANONYMOUS: POLLANS_ANONYMOUS
} = db.pollAnswerTable;

const POLL_ALL_RELATED_ATTR = `${POLL_POLLID}, ${POLL_TABLE}.${POLL_USERID}, ${POLL_QUESTION}, ${POLL_OPTIONS}, ${POLL_MULTIPLE_CHOICE}, ${POLL_PRIVATE}, ${POLL_DATE_CREATED}, ${POLL_LAST_UPDATED}, ${USER_NAME}`;

// @Help function - Remove a poll from redis
const removePollOutOfRedis = async (pollid) => {
  await redisClient.delAsync(`poll-${pollid}`);
  await redisClient.delAsync(`update-${pollid}`);
  await redisClient.delAsync(`cursor-update-${pollid}`);
  await redisClient.delAsync(`last-update-${pollid}`);
}

// @Help function - Add current score to a poll
const addCurrentScoreToPoll = async (poll) => {
  const currentScores = [];
  const args = [
    `poll-${poll[POLL_POLLID]}`,
    0,
    -1,
    "WITHSCORES"
  ]

  // REDIS/ Check if redis keep the most updated scores
  const data = await redisClient.zrangeAsync(args);
  data.forEach((s, i) => {
    // Assign to the current score
    if (!(i % 2)) {
      currentScores[+s] = data[i + 1];
    }
  });

  poll.scores = currentScores;
  return poll;
}

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
exports.postCreatePoll = async (req, res) => {
  const { user_id } = req.session.auth;
  const {
    question,
    options,
    isPrivate,
    multipleChoice
  } = req.body;

  // Check requirement
  if (!question.length || options.length <= 1) {
    acLog("Invalid polling information");
    return res.json({ message: "Invalid polling information" });
  } else if (!redisClient) {
    acLog("Cannot connect to Redis server");
    return res.json({ message: "Cannot connect to Redis server" });
  }

  try {
    // POSTGRES/ Write poll info
    const { rows } = await db.query(
      `INSERT INTO ${POLL_TABLE} (${POLL_USERID}, ${POLL_QUESTION}, ${POLL_OPTIONS}, ${POLL_PRIVATE}, ${POLL_MULTIPLE_CHOICE}) VALUES($1, $2, $3, $4, $5) RETURNING * `,
      [
        user_id,
        question,
        options,
        isPrivate,
        multipleChoice
      ]
    );

    // REDIS/ Check maximum pipeline:
    /*
      Max key                     = 2^32 = 4294967296 keys
      Perfomance                  = 1/10 = 429496729.6 keys
      Max users login at a time   = 1,000,000 users = 1,000,000 session keys
      One poll contains           = 4 keys (poll-, update-, last-, cursor-)
      Roughly maximum poll a time ~ 100,000,000 polls
     */
    /*
     const result = await redisClient.scanAsync([0, "MATCH", "poll-*"]);
     if (result[1].length >= 100000000) {
       // Implement removal metric assessment - current First In First Out
       const earliestPollid = result[1][result[1].length - 1].split("poll-")[1];
       await removePollOutOfRedis(earliestPollid);
     }
     */

    // REDIS/ Storage
    const redisPollName = 'poll-' + rows[0][POLL_POLLID];
    const startingScores = new Array(options.length).fill(0);
    const option_index = Array.apply(null, { length: rows[0][POLL_OPTIONS].length })
      .map(Number.call, Number);
    const args = _.flatten(_.zip(startingScores, option_index));

    args.unshift(redisPollName);
    await redisClient.zaddAsync(args);

    acLog(`User id ${rows[0][POLL_USERID]} created successfully poll id ${rows[0][POLL_POLLID]} `);
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
//            poll_id     Get a poll by id
exports.getAllPoll = async (req, res) => {
  const {
    user_id
  } = req.query;

  try {
    // POSTGRES/ query casual information
    let dbQueryStr = `
      SELECT ${ POLL_ALL_RELATED_ATTR}
      FROM ${ POLL_TABLE}
      INNER JOIN ${ USER_TABLE}
      ON ${ POLL_TABLE}.${POLL_USERID} = ${USER_TABLE}.${USER_USERID} `;

    if (user_id) {
      dbQueryStr += ` WHERE ${USER_TABLE}.${USER_USERID} = '${user_id}'
                      ORDER BY ${ POLL_DATE_CREATED} DESC
                      LIMIT ${ LIMIT_PER_PAGE}; `;
    } else {
      dbQueryStr += ` ORDER BY ${POLL_DATE_CREATED} DESC
                      LIMIT ${ LIMIT_PER_PAGE}; `;
    }

    const { rows } = await db.query(dbQueryStr);
    const pollWithScores = [];

    rows.forEach(async (poll, i) => {
      //REDIS/ Check if redis keep the most updated scores
      const updatedPoll = await addCurrentScoreToPoll(poll);
      pollWithScores.push(updatedPoll);

      if (i === (rows.length - 1)) {
        return res.send(pollWithScores);
      }
    });
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
}


//  @METHOD   GET
//  @PATH     /pollser/:pollid      
//  @DESC     Get a poll by id
exports.getPollById = async (req, res) => {
  const { pollid } = req.params;

  try {
    // POSTGRES/ query casual information
    let dbQueryStr = `
      SELECT ${POLL_ALL_RELATED_ATTR}
      FROM ${POLL_TABLE}
      INNER JOIN ${USER_TABLE}
      ON ${POLL_TABLE}.${POLL_USERID} = ${USER_TABLE}.${USER_USERID}
      WHERE ${POLL_TABLE}.${POLL_POLLID} = $1`;

    const { rows } = await db.query(dbQueryStr, [pollid]);
    const pollWithScores = await addCurrentScoreToPoll(rows[0]);
    return res.send([pollWithScores]);
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
exports.getVotePoll = async (req, res) => {
  const { pollid } = req.params;
  const { ans_index } = req.query;

  if (!pollid || !ans_index) {
    acLog("Missing information");
    return res.json({ message: "Missing information" });
  }

  // Check if anonymous vote
  let user_id = req.session.auth ? req.session.auth[USER_USERID] : ("anonymous-" + uuidV4());

  // REDIS/ Write to redis db
  const redisPollName = 'poll-' + pollid;
  const redisUpdateName = 'update-' + pollid;
  const ans_arr = ans_index.split(',');

  try {
    // Check if redis poll exist because of [overload redis keys/deleted poll] 
    const isExist = await redisClient.existsAsync(redisPollName);
    if (!isExist) {
      return res.send();
    }

    ans_arr.forEach(async (a, i) => {
      const args = [redisPollName, "1", a];
      // await sleep(10);
      await redisClient.zincrbyAsync(args);

      // Trigger socket.io when finished
      if (i === ans_arr.length - 1) {
        await sleep(10);
        publisher.publish("update-score", redisPollName);
      }
    });

    // REDIS/ Create the update key for poll
    // update-[poll_id] '{ user_id1: [0], user_id2: [0, 1] }'
    // update-[poll_id] '{ anonymous-uuid: [0] }'
    // await sleep(10);
    redisClient.watch(redisUpdateName, async (err) => {
      if (err) throw err;

      const data = await redisClient.getAsync(redisUpdateName);

      // If data not exist, create and store in redis
      let updatedData = {};
      if (data) {
        updatedData = await JSON.parse(data);
      }

      updatedData[user_id] = ans_arr;
      await sleep(10);
      // await redisClient.setAsync(redisUpdateName, JSON.stringify(updatedData));
      redisClient.multi()
        .set(redisUpdateName, JSON.stringify(updatedData))
        .exec((err) => { if (err) throw err; });

      if (user_id.startsWith("anonymous")) {
        acLog(`An anonymous voted poll ${pollid} choices ${ans_index} `);
      } else {
        acLog(`User ${user_id} voted poll ${pollid} choices ${ans_index} `);
      }

      return res.send();
    });
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};

//  @METHOD   DELETE
//  @PATH     /pollser/:pollid      
//  @DESC     Delete a poll
exports.deletePollById = async (req, res) => {
  const { pollid } = req.params;

  try {
    // REDIS/ Clear all the related key to pollid
    await removePollOutOfRedis(pollid);

    // POSTGRES/ Delete poll from Postgres
    await db.query(
      `DELETE FROM ${POLL_TABLE} WHERE ${POLL_POLLID} = $1`,
      [pollid]
    );

    acLog(`User ${req.session.auth[USER_USERID]} delete poll ${pollid} `)
    return res.send();
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
}
