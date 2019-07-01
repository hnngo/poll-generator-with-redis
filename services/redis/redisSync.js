const db = require('../../models/postgres');
const acLog = require('../../utils/acLog');
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

    const pollArr = rows;

    // Create each poll in redis db if it not existed
    pollArr.forEach((poll, i) => {
      const redisPollSet = `poll-${poll[POLL_POLLID]}`;

      redisClient.exists(redisPollSet, async (isExist) => {
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
          redisClient.zadd(args, (err) => {
            if (err) throw err;
          });
        }
      });
    });

    // Set Interval update postgres for every 5 seconds
    setInterval(async () => {
      acLog("Redis Interval checking");
      try {
        // REDIS/ Check if key pattern update-
        // update-[poll_id] '{ user_id1: [0], user_id2: [0, 1] }'
        redisClient.keys('update-*', (err, data) => {
          if (err) throw err;
          else if (!data.length) {
            return;
          }

          // Write update to postgres
          data.forEach((d, i) => {
            redisClient.get(d, async (err, data) => {
              if (err) throw err;

              // POSTGRES/
              const formattedData = JSON.parse(data);
              const pollid = d.split('update-')[1];
              const votees = Object.keys(formattedData);
              votees.forEach(async (v) => {
                if (v.includes('anonymous')) {
                  await db.query(
                    `INSERT INTO ${POLLANS_TABLE} (${POLLANS_POLLID}, ${POLLANS_ANONYMOUS}, ${POLLANS_INDEX}) VALUES ($1, $2, $3)`,
                    [pollid, true, formattedData[v]]
                  );
                } else {
                  await db.query(
                    `INSERT INTO ${POLLANS_TABLE} (${POLLANS_POLLID}, ${POLLANS_USERID}, ${POLLANS_INDEX}) VALUES ($1, $2, $3)`,
                    [pollid, v, formattedData[v]]
                  );
                }

                // Delete from redis db
                redisClient.del(d);
              });

              await db.query(
                `UPDATE ${POLL_TABLE}
                 SET ${POLL_LAST_UPDATED} = DEFAULT
                 WHERE ${POLL_POLLID} = $1`,
                [pollid]
              );
            });
          });
        });
      } catch (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }
    }, 7000);
  } catch (err) {
    acLog(err);
    throw err;
  }
};
