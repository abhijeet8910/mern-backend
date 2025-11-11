const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../utils/jwt"); // middleware to protect routes
const upload = require("../middlewares/uploads"); // middleware for image uploads

const {
  createRating,
  getProductRatings,
  deleteRating
} = require("../controllers/Rating.controller");

// @route   POST /api/ratings/create
router.post("/create", VerifyToken, upload.single("image"), createRating);

// @route   GET /api/ratings/product/:productId
router.get("/product/:productId", getProductRatings);

// @route   DELETE /api/ratings/:id
router.delete("/:id", VerifyToken, deleteRating);

module.exports = router;
