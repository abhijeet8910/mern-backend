const express = require("express");
const router = express.Router();
const { VerifyToken, IsSeller } = require("../utils/jwt");
const upload = require("../middlewares/uploads"); // ✅ Import multer middleware

const {
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
} = require("../controllers/Product.controller");

// @route   GET /api/products/test
// @desc    Check if product routes are working
// @access  Public
router.get("/test", (req, res) => res.send("Product routes are working"));

// @route   POST /api/products/add
// @desc    Add a new product (Only for Sellers)
// @access  Private (Seller only)
router.post("/add", VerifyToken, IsSeller, upload.single("image"), addProduct);

// @route   PUT /api/products/update/:id
// @desc    Update an existing product (Only for Sellers)
// @access  Private (Seller only)
router.put("/update/:id", VerifyToken, IsSeller, upload.single("image"), updateProduct);

// @route   DELETE /api/products/delete/:id
// @desc    Delete a product (Only for Sellers)
// @access  Private (Seller only)
router.delete("/delete/:id", VerifyToken, IsSeller, deleteProduct);

// @route   GET /api/products/seller/:id
// @desc    Get all products from a specific seller
// @access  Public
router.get("/seller/:id", getSellerProducts);

// @route   GET /api/products/all
// @desc    Get all available products (For users)
// @access  Public
router.get("/all", getAllProducts);

// ✅ @route   GET /api/products/:id
// ✅ @desc    Get single product by ID (for editing or viewing)
// ✅ @access  Public
router.get("/:id", getProductById);

module.exports = router;
