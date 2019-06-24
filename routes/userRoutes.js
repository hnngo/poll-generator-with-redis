const express = require('express');
const router = express.Router();
const { isLogin, isLogout } = require('../utils/requiredMiddleware');
const userController = require('../controllers/userController');


//  @METHOD   GET
//  @PATH     /user/get-all-users      
//  @DESC     Get all current users
router.get('/get-all-users', userController.getAllUsers);

//  @METHOD   GET
//  @PATH     /user/current
//  @DESC     Get all current users
router.get('/current', userController.getCurrentUser);

//  @METHOD   GET
//  @PATH     /user/logout
//  @DESC     Get all current users
router.get('/logout', isLogin, userController.getLogout);

//  @METHOD   POST
//  @PATH     /user/signin      
//  @DESC     Sign in 
router.post('/signin', isLogout, userController.postSignInUserWithEmailAndPassword);

//  @METHOD   POST
//  @PATH     /user/signup      
//  @DESC     Create new user 
router.post('/signup', isLogout, userController.postSignUpUserWithEmailAndPassword);

//  @METHOD   GET
//  @PATH     /user/:userid
//  @DESC     Get user by id
router.get('/:userid', userController.getUserById);

//  @METHOD   DELETE
//  @PATH     /user/:userid      
//  @DESC     Create new user 
// router.delete('/:userid', userController.deleteUserById);

module.exports = router;
