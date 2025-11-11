const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ["Seed", "Indoor Plant", "Medicinal Plants", "Flower", "Outdoor Plant", "herbs", "ayurvedic"],

      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0 // Ensuring stock is always a valid number
    },
    imageUrl: {
      type: String,
      default: "" // Image URL for product
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true // Ensure that only sellers can add products
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
