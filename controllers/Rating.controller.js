const Rating = require("../models/Rating.model");
const Product = require("../models/Product.model");

// Create a new rating
exports.createRating = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // assuming you are using a middleware that adds req.user
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/uploads/ratings/${req.file.filename}`; // Adjust path as needed
    }

    // Optional: Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newRating = new Rating({
      user: userId,
      product: productId,
      rating,
      comment,
      imageUrl
    });

    await newRating.save();

    res.status(201).json({ message: "Rating created successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create rating" });
  }
};

// Get all ratings for a product
exports.getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ product: productId })
      .populate("user", "name") // if you want to show user's name
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get ratings" });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // assuming authentication middleware

    const rating = await Rating.findById(id);

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (rating.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this rating" });
    }

    await rating.deleteOne();

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete rating" });
  }
};
