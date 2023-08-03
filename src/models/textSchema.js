const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});


const review = mongoose.model('review', reviewSchema);


module.exports = review;
