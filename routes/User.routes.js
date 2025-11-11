const express = require('express');
const router = express.Router();
const { RegisterUser, LoginUser, GetDetails, UpdateProfile } = require('../controllers/User.controller');
const { ValidateRegister, ValidateLogin } = require('../middlewares/expressvalidator');
const { VerifyToken } = require('../utils/jwt');

// @route   GET /api/user/test
// @desc    Check if routes are working
// @access  Public
router.get('/test', (req, res) => res.send("User routes are working"));

// @route   POST /api/user/register
// @desc    Register a new user
// @access  Public
router.post('/register', ValidateRegister,RegisterUser);

// @route   POST /api/user/login
// @desc    Login a user
// @access  Public
router.post('/login', ValidateLogin, LoginUser);

// @route   GET /api/user/profile/:id
// @desc    Get user details by ID
// @access  Private
router.get('/profile/:id',VerifyToken, GetDetails); 

router.put('/profile/update/:id', VerifyToken, UpdateProfile);

module.exports = router;
