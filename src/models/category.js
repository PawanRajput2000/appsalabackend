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
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
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
});

// Define the Category model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
