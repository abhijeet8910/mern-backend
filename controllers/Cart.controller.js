const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const AsyncHandler = require("../middlewares/asynchandler");
const addToCart = AsyncHandler(async (req, res) => {
  console.log("🛒 Add to cart request body:", req.body); // log here

  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ success: false, message: "Product ID and quantity are required" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Item added to cart", cart });
});

// ✅ Remove item from cart
const removeFromCart = AsyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  res.status(200).json({ success: true, message: "Item removed from cart", cart });
});

// ✅ Get cart for logged-in user
const getCart = AsyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) {
    return res.status(200).json({ success: true, cart: { items: [] } });
  }
  res.status(200).json({ success: true, cart });
});

// ✅ Clear cart
const clearCart = AsyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(200).json({ success: true, message: "Cart cleared" });
});
// ✅ Update quantity (increase or decrease)
const updateCartQuantity = AsyncHandler(async (req, res) => {
  const { productId, action } = req.body; // action = 'increase' | 'decrease'

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return res.status(404).json({ success: false, message: "Product not found in cart" });
  }

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity < 1) {
      // Optional: remove item if quantity < 1
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    }
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Cart updated", cart });
});


module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCartQuantity
};
