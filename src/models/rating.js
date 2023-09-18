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
    Usability: {
      type: Number,
      default: 0
    },
    Performance: {
      type: Number,
      default: 0
    },
    Features: {
      type: Number,
      default: 0
    },
    Support: {
      type: Number,
      default: 0
    },
    Value: {
      type: Number,
      default: 0
    },
    Company: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  
})



module.exports = mongoose.model("rating", ratingScehma)