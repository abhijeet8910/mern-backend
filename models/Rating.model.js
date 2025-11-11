const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String, // URL of the uploaded image
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
