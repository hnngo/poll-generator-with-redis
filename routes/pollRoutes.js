const express = require('express');
const router = express.Router();
const { isLogin } = require('../utils/requiredMiddleware');
const pollController = require('../controllers/pollController');


function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
router.post('/create', isLogin, pollController.postCreatePoll);

module.exports = router;