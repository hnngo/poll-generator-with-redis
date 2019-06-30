const acLog = require('../utils/acLog');
const db = require('../models/postgres');
const bcrypt = require('bcrypt');

// Prepare Attributes Constant
const {
  TBL_NAME: USER_TABLE,
  ATTR_EMAIL: USER_EMAIL,
  ATTR_NAME: USER_NAME,
  ATTR_PASSWORD: USER_PASSWORD,
  ATTR_USERID: USER_USERID
} = db.userTable;

const {
  TBL_NAME: POLLANS_TABLE,
  ATTR_POLLANS_ID: POLLANS_ID,
  ATTR_POLLID: POLLANS_POLLID,
  ATTR_USERID: POLLANS_USERID,
  ATTR_ANSWER_INDEX: POLLANS_INDEX
} = db.pollAnswerTable;

const ALL_ATTR_EXCEPT_PWD = `${USER_USERID}, ${USER_EMAIL}, ${USER_NAME}`;

const getALlVotedPolls = async (userId) => {
  const { rows } = await db.query(
    `SELECT ${POLLANS_POLLID}, ${POLLANS_INDEX} FROM ${POLLANS_TABLE}
     WHERE ${POLLANS_USERID} = $1`,
    [userId]
  );

  // Prepare the voted polls object
  const res = {};
  rows.map((p) => {
    res[p[POLLANS_POLLID]] = p[POLLANS_INDEX];
  })

  return res;
}

//  @METHOD   GET
//  @PATH     /user/get-all-users      
//  @DESC     Get all current users
exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM ${USER_TABLE}`);

    return res.send(rows);
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};

//  @METHOD   GET
//  @PATH     /user/current
//  @DESC     Get current users
exports.getCurrentUser = async (req, res) => {
  const userInfo = req.session.auth;

  // Get voted polls if existed
  if (userInfo) {
    userInfo.votedPolls = await getALlVotedPolls(userInfo[USER_USERID]);
  }

  return res.send(userInfo);
};

//  @METHOD   GET
//  @PATH     /user/:userid
//  @DESC     Get all current users
exports.getUserById = async (req, res) => {
  const { userid } = req.params;

  // Check if missing any information
  if (!userid) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  try {
    const { rows } = await db.query(
      `SELECT * FROM ${USER_TABLE} WHERE ${USER_USERID} = $1`,
      [userid]
    );

    return res.send(rows);
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};

//  @METHOD   GET
//  @PATH     /user/logout
//  @DESC     Log out
exports.getLogout = (req, res) => {
  if (req.session.auth) {
    req.session.destroy();
    return res.send();
  }
};

//  @METHOD   POST
//  @PATH     /user/signin      
//  @DESC     Sign in user
exports.postSignInUserWithEmailAndPassword = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  // Check if missing any information
  if (!email || !password) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  try {
    const result = await db.query(
      `SELECT * FROM ${USER_TABLE} WHERE ${USER_EMAIL} = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.send({ errMsg: `User ${email} is not found` });
    }

    const existingUser = result.rows[0];
    bcrypt.compare(password, existingUser.password, async (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        acLog(`${existingUser.email} login with wrong password`);
        return res.send({ errMsg: "Password is incorrect" })
      }

      const userInfo = {
        user_id: existingUser[USER_USERID],
        name: existingUser[USER_NAME],
        email: existingUser[USER_EMAIL]
      };

      // Store the session
      req.session.auth = userInfo;

      // Get all the voted polls and choices
      userInfo.votedPolls = await getALlVotedPolls(userInfo[USER_USERID]);

      // Return the value
      acLog(`${existingUser.email} login successfully`);
      return res.send(userInfo);
    });
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};

//  @METHOD   POST
//  @PATH     /user/signup      
//  @DESC     Create new user
exports.postSignUpUserWithEmailAndPassword = (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;

  // Check if missing any information
  if (!name || !email || !password) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  // Encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hashPwd) => {
      if (err) throw err;

      try {
        const { rows } = await db.query(
          `INSERT INTO ${USER_TABLE} (${USER_NAME}, ${USER_EMAIL}, ${USER_PASSWORD}) VALUES ($1, $2, $3) RETURNING ${ALL_ATTR_EXCEPT_PWD}`,
          [name, email, hashPwd]
        );

        // Store the session
        req.session.auth = rows[0];

        acLog(`Create successfully user ${rows[0].email}`);
        return res.send(rows[0]);
      } catch (err) {
        acLog(err);
        return res.send({ errMsg: `${email} has already been existed` });
      }
    });
  });
};

//  @METHOD   DELETE
//  @PATH     /user/:userid      
//  @DESC     Create new user 
exports.deleteUserById = async (req, res) => {
  const { userid } = req.params;

  // Check if missing any information
  if (!userid) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  try {
    await db.query(
      `DELETE FROM ${USER_TABLE} WHERE ${USER_USERID} = $1`,
      [userid]
    );

    return res.send();
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};
