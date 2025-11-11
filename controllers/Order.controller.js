const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const AsyncHandler = require("../middlewares/asynchandler");
const Razorpay = require("../utils/razorpay"); // NEW

const createRazorpayOrder = AsyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await Razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("💥 Razorpay error:", err); // Log error in backend
    res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: err.message });
  }
});


// ✅ Place a new order
const placeOrder = AsyncHandler(async (req, res) => {
  const { items, shippingAddress, seller, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "No items to order" });
  }

  let totalAmount = 0;
  const orderItems = [];

  for (let item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for: ${product.name}` });
    }

    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = new Order({
    user: req.user._id,
    seller,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending", // NEW
  });

  await order.save();
  res.status(201).json({ success: true, message: "Order placed successfully", order });
});

// ✅ Get all orders of the logged-in user
const getUserOrders = AsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.status(200).json({ success: true, orders });
});

// ✅ Get all orders for a seller
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Find all orders that include products from this seller
    const orders = await Order.find({
      'items.seller': sellerId,
    })
      .populate('user', 'name email address') // populate user info
      .populate('items.product', 'name price'); // populate product info

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error: Could not fetch orders' });
  }
};

// ✅ Get single order by ID
const getOrderById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("items.product user seller");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.status(200).json({ success: true, order });
});

// ✅ Update order status (for seller or admin)
const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  order.status = status;
  await order.save();

  res.status(200).json({ success: true, message: "Order status updated", order });
});
const cancelOrder = AsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  await order.deleteOne();
  res.status(200).json({ success: true, message: "Order cancelled" });
});

module.exports = {
  placeOrder,
  createRazorpayOrder, // NEW
  getUserOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
