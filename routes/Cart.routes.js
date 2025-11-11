const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../utils/jwt");
const {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCartQuantity
} = require("../controllers/Cart.controller");

// @route   GET /api/cart/test
// @desc    Check if cart routes are working
// @access  Public
router.get("/test", (req, res) => res.send("Cart routes are working"));

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post("/add", VerifyToken, addToCart);

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete("/remove/:productId", VerifyToken, removeFromCart);

// @route   GET /api/cart/
// @desc    Get logged-in user's cart
// @access  Private
router.get("/", VerifyToken, getCart);

// @route   DELETE /api/cart/clear
// @desc    Clear user's cart
// @access  Private
router.delete("/clear", VerifyToken, clearCart);
// @route   PUT /api/cart/update
// @desc    Update quantity (increase/decrease)
// @access  Private
router.put("/update", VerifyToken, updateCartQuantity);


module.exports = router;
