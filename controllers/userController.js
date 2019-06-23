const acLog = require('../utils/acLog');
const db = require('../models/postgres');

const {
  TBL_NAME: USER_TABLE,
  ATTR_EMAIL,
  ATTR_NAME,
  ATTR_PASSWORD
} = db.userTable;

//  @METHOD   POST
//  @PATH     /auth/signup      
//  @DESC     Create new user
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


//  @METHOD   POST
//  @PATH     /auth/signup      
//  @DESC     Create new user
exports.postCreateNewUser = (req, res) => {
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

  db.query(
    `INSERT INTO ${USER_TABLE} (${ATTR_NAME}, ${ATTR_EMAIL}, ${ATTR_PASSWORD}) VALUES ($1, $2, $3)`,
    [name, email, password],
    (err, result) => {
      if (err) {
        acLog(err);
        return res.send({ errMsg: err });
      }
      console.log(result)
      return res.send("Create Successfully")
    }
  )
};
