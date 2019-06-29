const acLog = require('../utils/acLog');
const db = require('../models/postgres');
const bcrypt = require('bcrypt');

// Prepare Attributes Constant
const {
  TBL_NAME: USER_TABLE,
  ATTR_EMAIL,
  ATTR_NAME,
  ATTR_PASSWORD,
  ATTR_USERID
} = db.userTable;
const ALL_ATTR_EXCEPT_PWD = `${ATTR_USERID}, ${ATTR_EMAIL}, ${ATTR_NAME}`;

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
exports.getCurrentUser = (req, res) => {
  return res.send(req.session.auth);
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
      `SELECT * FROM ${USER_TABLE} WHERE ${ATTR_USERID} = $1`,
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
      `SELECT * FROM ${USER_TABLE} WHERE ${ATTR_EMAIL} = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.send({ errMsg: `User ${email} is not found` });
    }

    const existingUser = result.rows[0];
    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        acLog(`${existingUser.email} login with wrong password`);
        return res.send({ errMsg: "Password is incorrect" })
      }

      const userInfo = {
        user_id: existingUser[ATTR_USERID],
        name: existingUser[ATTR_NAME],
        email: existingUser[ATTR_EMAIL]
      };

      // Store the session
      req.session.auth = userInfo;

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
          `INSERT INTO ${USER_TABLE} (${ATTR_NAME}, ${ATTR_EMAIL}, ${ATTR_PASSWORD}) VALUES ($1, $2, $3) RETURNING ${ALL_ATTR_EXCEPT_PWD}`,
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
      `DELETE FROM ${USER_TABLE} WHERE ${ATTR_USERID} = $1`,
      [userid]
    );

    return res.send();
  } catch (err) {
    acLog(err);
    return res.send({ errMsg: err });
  }
};
