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

//  @METHOD   GET
//  @PATH     /vote/:pollid
//  @DESC     Vote for a poll
//  @QUERY    user_id     Vote by a user identity
//            ans_index   Index of choice(s)
router.get('/vote/:pollid', pollController.getVotePoll);

//  @METHOD   GET
//  @PATH     /pollser/all      
//  @DESC     Get all current poll
router.get('/all', pollController.getAllPoll);

//  @METHOD   GET
//  @PATH     /pollser/:pollid      
//  @DESC     Get poll by poll id
//  @QUERY    user_id     Get all poll of a user
router.get('/:pollid', pollController.getPollById);

module.exports = router;
