const Product = require("../models/Product.model");
const Seller = require("../models/Seller.model");
const AsyncHandler = require("../middlewares/asynchandler");

// ✅ Add a new product (Only Seller)
const addProduct = AsyncHandler(async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({ success: false, message: "Unauthorized: Only sellers can add products" });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
    seller: req.user._id,
  });

  await product.save();
  res.status(201).json({ success: true, message: "Product added successfully", product });
});

// ✅ Update an existing product (Only Seller)
const updateProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized: Only the product owner can update it" });
  }

  const updatedData = {
    ...req.body,
  };

  // If new image uploaded, update imageUrl
  if (req.file) {
    updatedData.imageUrl = `/uploads/${req.file.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
  res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
});

// ✅ Delete a product (Only Seller)
const deleteProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized: Only the product owner can delete it" });
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

// ✅ Get all products by a specific seller
const getSellerProducts = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const products = await Product.find({ seller: id });
  res.status(200).json({ success: true, products });
});

// ✅ Get all products (for users or general display)
const getAllProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ success: true, products });
});

// ✅ Get a single product by ID (needed for Edit page)
const getProductById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, product });
});

// ✅ Export all controller functions
module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
};
