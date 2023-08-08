const mongoose = require("mongoose")

const user = new mongoose.Schema({


    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    following_app: [
        {
            obj_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'App'
            },
            status: {
                type: String,
                enum: ["Yes", "No", "Maybe"],
                default: 'No'

            }, subscription: {
                date: {
                    type: Date,
                    default: Date.now()
                }, amount: {
                    type: Number,
                    required: true
                }, duration: {
                    type: Number,
                    required: true
                }

            }
        }
    ],





}, {
    timestamps: true,
    get: time => time.toDateString()
})



module.exports = mongoose.model("user", user)





