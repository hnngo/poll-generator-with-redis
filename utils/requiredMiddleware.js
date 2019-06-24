const acLog = require('./acLog');

exports.isLogin = (req, res, next) => {
  if (!req.session.auth) {
    acLog('You need to login to perform this action');
    return res.send({ errMsg: 'You need to login to perform this action' });
  }

  next();
};

exports.isLogout = (req, res, next) => {
  if (req.session.auth) {
    acLog('You need to log out the current session to perform this action');
    return res.send({ errMsg: 'You need to log out the current session to perform this action' });
  }

  next();
};
