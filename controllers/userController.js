const acLog = require('../utils/acLog');
const db = require('../models/postgres');

// Prepare constant
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

//  @METHOD   POST
//  @PATH     /auth/signup      
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

  // Create new user
  db.query(
    `INSERT INTO ${USER_TABLE} (${ATTR_NAME}, ${ATTR_EMAIL}, ${ATTR_PASSWORD}) VALUES ($1, $2, $3)`,
    [name, email, password],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
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

          return res.send(result.rows[0])
        }
      )
    }
  );
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