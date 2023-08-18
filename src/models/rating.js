const mongoose = require("mongoose")


const ratingScehma = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App',
    required: true
  },
  rating: {
      Usability: Number,
      Performance: Number,
      Features: Number,
      Support: Number,
      Value: Number,
      Company: Number,
  }
}, {
  timestamps: true,
  
})



module.exports = mongoose.model("rating", ratingScehma)