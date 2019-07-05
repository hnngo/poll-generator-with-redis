const express = require('express');
const router = express.Router();
const { isLogin } = require('../utils/requiredMiddleware');
const pollController = require('../controllers/pollController');

//  @METHOD   POST
//  @PATH     /pollser/create      
//  @DESC     Start the polling with predefined setting
router.post('/create', isLogin, pollController.postCreatePoll);

//  @METHOD   GET
//  @PATH     /vote/:pollid
//  @DESC     Vote for a poll
//  @QUERY    ans_index   Index of choice(s)
router.get('/vote/:pollid', pollController.getVotePoll);

//  @METHOD   GET
//  @PATH     /pollser/all      
//  @DESC     Get all current poll
//  @QUERY    user_id     Get all poll of a user
router.get('/all', pollController.getAllPoll);

//  @METHOD   DELETE
//  @PATH     /pollser/:pollid      
//  @DESC     Delete a poll
router.delete('/:pollid', pollController.deletePollById);

module.exports = router;
