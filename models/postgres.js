const { Pool } = require('pg');
const acLog = require('../utils/acLog');
const connectionString = 'postgresql://polladmin:password@localhost:5432/pollredis';

// Create new Pool
const pool = new Pool({ connectionString });

pool.query('SELECT NOW()', (err, res) => {
  if (!err) acLog("Connected to pollredis database from user polladmin");
});

module.exports = {
  // Constants
  userTable: {
    TBL_NAME: "users",
    ATTR_USERID: "user_id",
    ATTR_EMAIL: "email",
    ATTR_NAME: "name",
    ATTR_PASSWORD: "password",
  },

  pollTable: {
    TBL_NAME: "polls",
    ATTR_POLLID: "poll_id",
    ATTR_USERID: "user_id",
    ATTR_QUESTION: "question",
    ATTR_OPTIONS: "options",
    ATTR_PRIVATE: "private",
    ATTR_MULTIPLE_CHOICE: "multiple_choice",
    ATTR_DATE_CREATED: "date_created",
    ATTR_LAST_UPDATED: "last_updated",
  },

  pollAnswerTable: {
    TBL_NAME: "poll_answers",
    ATTR_POLLANS_ID: "pollanswer_id",
    ATTR_POLLID: "poll_id",
    ATTR_USERID: "user_id",
    ATTR_ANSWER_INDEX: "answer_index",
    ATTR_ANONYMOUS: "anonymous"
  },

  // Functions
  query: (text, params) => {
    return pool.query(text, params);
  }
};
