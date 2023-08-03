const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
   name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parent_id: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    description: {
        type: String,
        default: null
    },
    image: {
        url: String,
        public_id: String
},
});
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
