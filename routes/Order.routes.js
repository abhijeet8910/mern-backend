const express = require("express");
const router = express.Router();
const { VerifyToken, IsSeller } = require("../utils/jwt");
const {
  placeOrder,
  createRazorpayOrder, // NEW
  getUserOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/Order.controller");

// @route   GET /api/orders/test
router.get("/test", (req, res) => res.send("Order routes are working"));

// @route   POST /api/orders/place
router.post("/place", VerifyToken, placeOrder);

// @route   POST /api/orders/create-payment
router.post("/create-payment", VerifyToken, createRazorpayOrder); // NEW

// @route   GET /api/orders/user
router.get("/user", VerifyToken, getUserOrders);

// @route   GET /api/orders/seller
router.get("/seller", VerifyToken, IsSeller, getSellerOrders);

// @route   GET /api/orders/:id
router.get("/:id", VerifyToken, getOrderById);

// @route   PUT /api/orders/status/:id
router.put("/status/:id", VerifyToken, IsSeller, updateOrderStatus);
router.delete("/cancel/:id", VerifyToken, cancelOrder);

module.exports = router;
