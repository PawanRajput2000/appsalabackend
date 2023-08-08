const mongoose = require("mongoose");

// Define the Schema for Category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  subCategory_ids: [{
    type: mongoose.Schema.Types.ObjectId, // Keep the array brackets here for multiple IDs
    ref: "Category",
    default: null,
  }],
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
}, {
  timestamps: true
});

// Define the Category model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
