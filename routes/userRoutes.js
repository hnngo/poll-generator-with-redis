const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//  @METHOD   POST
//  @PATH     /auth/signup      
//  @DESC     Create new user 
router.get('/get-all-users', userController.getAllUsers);

//  @METHOD   POST
//  @PATH     /auth/signup      
//  @DESC     Create new user 
router.post('/signup', userController.postCreateNewUser);

module.exports = router;
