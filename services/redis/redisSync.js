const db = require('../../models/postgres');
const { acLog, sleep } = require('../../utils/helpFuncs');
const _ = require('lodash');

const {
  TBL_NAME: POLL_TABLE,
  ATTR_POLLID: POLL_POLLID,
  ATTR_USERID: POLL_USERID,
  ATTR_QUESTION: POLL_QUESTION,
  ATTR_OPTIONS: POLL_OPTIONS,
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

module.exports = async (redisClient) => {
  try {
    const { rows } = await db.query(
      `SELECT ${POLL_POLLID}, ${POLL_OPTIONS} FROM ${POLL_TABLE}
       ORDER BY ${POLL_DATE_CREATED} DESC
       LIMIT 1000`
    );

    // Create each poll in redis db if it not existed
    rows.forEach(async (poll, i) => {
      const redisPollSet = `poll-${poll[POLL_POLLID]}`;

      await sleep(10);
      const isExist = await redisClient.existsAsync(redisPollSet);
      if (!isExist) {
        // Get the current score
        const scores = [];
        for (let index = 0; index < poll[POLL_OPTIONS].length; index++) {
          const res = await db.query(
            `SELECT ${POLLANS_ID} FROM ${POLLANS_TABLE} 
               WHERE ${POLLANS_POLLID} = $1 AND $2 = ANY(${POLLANS_INDEX})`,
            [poll[POLL_POLLID], index]
          );

          scores.push(+res.rowCount);
        }

        const opt_index = Array.apply(null, { length: poll[POLL_OPTIONS].length }).map(Number.call, Number);

        const args = _.flatten(_.zip(scores, opt_index));
        args.unshift(redisPollSet);

        // Add to Redis DB
        await sleep(10);
        await redisClient.zadd(args);
      }
    });

    // Set interval updating postgres
    setInterval(async () => {
      try {
        // REDIS/ Check if key pattern update-
        // update-[poll_id] '{ user_id1: [0], user_id2: [0, 1] }'
        await sleep(10);
        const result = await redisClient.scanAsync([0, "MATCH", "update-*"]);
        if (result[1].length) {
          // Write update to postgres
          result[1].forEach(async (d, i) => {
            await sleep(10);
            const data = await redisClient.getAsync(d);
            let cursor = await redisClient.getAsync("cursor-" + d);
            if (!cursor) { cursor = -1; }

            // POSTGRES/
            const formattedData = JSON.parse(data);
            const pollid = d.split('update-')[1];
            const votees = Object.keys(formattedData);
            const numberOfRemainingVotes = votees.length - 1 - (+cursor);
            if (!numberOfRemainingVotes) return;

            acLog(`Flush to Postgres: ${numberOfRemainingVotes} update(s)`);
            votees.forEach(async (v, i) => {
              if (i <= cursor) {
                return;
              }

              if (v.includes('anonymous')) {
                // PENDING: Check transaction
                // await db.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE')
                await db.query(
                  `INSERT INTO ${POLLANS_TABLE} (${POLLANS_POLLID}, ${POLLANS_ANONYMOUS}, ${POLLANS_INDEX}) VALUES ($1, $2, $3)`,
                  [pollid, true, formattedData[v]]
                );
                // await db.query('COMMIT');
              } else {

                // await db.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
                await db.query(
                  `INSERT INTO ${POLLANS_TABLE} (${POLLANS_POLLID}, ${POLLANS_USERID}, ${POLLANS_INDEX}) VALUES ($1, $2, $3)`,
                  [pollid, v, formattedData[v]]
                );
                // await db.query('COMMIT');
              }

              if (i === votees.length - 1) {
                await redisClient.setAsync("cursor-" + d, i);
              }
            });

            await db.query(
              `UPDATE ${POLL_TABLE}
                 SET ${POLL_LAST_UPDATED} = DEFAULT
                 WHERE ${POLL_POLLID} = $1`,
              [pollid]
            );

            await sleep(10);
            await redisClient.setAsync("last-" + d, new Date());
            // await redisClient.delAsync(d);
          });
        }

        // REDIS/ Check any ideal update exist
        await sleep(10);
        const updateTime = await redisClient.scanAsync([0, "MATCH", "last-update-*"]);
        if (!updateTime[1].length) {
          return;
        }

        updateTime[1].forEach(async (p) => {
          await sleep(10);
          const pollid = p.split("last-update-")[1];
          const lastTimeUpdate = await redisClient.getAsync(p);

          if (((new Date()) - (new Date(lastTimeUpdate))) > 5 * 60 * 1000) {
            await sleep(10);
            await redisClient.delAsync(`update-${pollid}`);
            await redisClient.delAsync(`cursor-update-${pollid}`);
            await redisClient.delAsync(p);
          }
        });
      } catch (err) {
        acLog(err);
      }
    }, 10000);
  } catch (err) {
    acLog(err);
    throw err;
  }
};
