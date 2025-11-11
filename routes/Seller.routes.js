const express = require('express');
const router = express.Router();
const { 
    RegisterSeller, 
    LoginSeller, 
    GetSellerDetails, 
    GetSellerOrders, 
    UpdateOrderStatus 
} = require('../controllers/Seller.controller');

const { 
    ValidateSellerRegister, 
    ValidateSellerLogin 
} = require('../middlewares/expressvalidator');

const { VerifyToken } = require('../utils/jwt');

// @route   GET /api/seller/test
// @desc    Check if routes are working 
// @access  Public
router.get('/test', (req, res) => res.send("Seller routes are working"));

// @route   POST /api/seller/register
// @desc    Register a new seller
// @access  Public
router.post('/register', ValidateSellerRegister, RegisterSeller);

// @route   POST /api/seller/login
// @desc    Login a seller and return JWT token
// @access  Public
router.post('/login', ValidateSellerLogin, LoginSeller);

// @route   GET /api/seller/profile/:id
// @desc    Get seller details by ID
// @access  Private
router.get('/profile', VerifyToken, GetSellerDetails);

// @route   GET /api/seller/orders
// @desc    Get all orders for the logged-in seller
// @access  Private
router.get('/orders', VerifyToken, GetSellerOrders);

// @route   PUT /api/seller/order/:orderId/status
// @desc    Update order status (Processing → Shipped → Delivered)
// @access  Private
router.put('/order/:orderId/status', VerifyToken, UpdateOrderStatus);

module.exports = router;
