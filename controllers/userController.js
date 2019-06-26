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
exports.getAllUsers = (req, res) => {
  db.query(
    `SELECT * FROM ${USER_TABLE}`,
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }

      return res.send(result);
    }
  )
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
exports.getUserById = (req, res) => {
  const { userid } = req.params;

  // Check if missing any information
  if (!userid) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  db.query(
    `SELECT * FROM ${USER_TABLE} WHERE ${ATTR_USERID} = $1`,
    [userid],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }

      return res.send(result);
    }
  )
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
exports.postSignInUserWithEmailAndPassword = (req, res) => {
  const {
    email,
    password
  } = req.body;

  // Check if missing any information
  if (!email || !password) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  // Query existing user to return to client
  db.query(
    `SELECT * FROM ${USER_TABLE} WHERE ${ATTR_EMAIL} = $1`,
    [email],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      } else if (result.rowCount === 0) {
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
          userid: existingUser[ATTR_USERID],
          name: existingUser[ATTR_NAME],
          email: existingUser[ATTR_EMAIL]
        };

        // Store the session
        req.session.auth = userInfo;

        // Return the value
        acLog(`${existingUser.email} login successfully`);
        return res.send(userInfo);
      })
    }
  );
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
    bcrypt.hash(password, salt, (err, hashPwd) => {
      // Create new user
      db.query(
        `INSERT INTO ${USER_TABLE} (${ATTR_NAME}, ${ATTR_EMAIL}, ${ATTR_PASSWORD}) VALUES ($1, $2, $3)`,
        [name, email, hashPwd],
        (err, result) => {
          if (err) {
            acLog(err);
            return res.send({ errMsg: `${email} has already been existed` });
          }

          // Query new user to return to client
          db.query(
            `SELECT ${ALL_ATTR_EXCEPT_PWD} FROM ${USER_TABLE} WHERE ${ATTR_EMAIL} = $1`,
            [email],
            (err, result) => {
              if (err) {
                acLog(err);
                return res.send({ errMsg: err });
              }
              // Store the session
              req.session.auth = result.rows[0];

              acLog(`Create successfully user ${result.rows[0].email}`);
              return res.send(result.rows[0]);
            }
          )
        }
      );
    })
  });
};

//  @METHOD   DELETE
//  @PATH     /user/:userid      
//  @DESC     Create new user 
exports.deleteUserById = (req, res) => {
  const { userid } = req.params;

  // Check if missing any information
  if (!userid) {
    acLog("Missing information");
    return res.send({ errMsg: "Missing information" });
  }

  // Create new user
  db.query(
    `DELETE FROM ${USER_TABLE} WHERE ${ATTR_USERID} = $1`,
    [userid],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }

      return res.send(result)
    }
  );
};
