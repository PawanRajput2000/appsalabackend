
const mongoose = require("mongoose")


const commentSchema = new mongoose.Schema({
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
    comment: {
      type: String,
      required: true
    }
  },{
    timestamps: true,
    get: time => time.toDateString()
})



  module.exports = mongoose.model("comment",commentSchema)