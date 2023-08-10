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
    role:{
        type :String,
        enum:["admin","user"],
        required :true
    },
    following_app: [
        {
            obj_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'App'
            },
            status: {
                type: String,
                enum: ["Using","Yes", "No", "Maybe",],
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
                },package :{
                    type :String,
                    
                },rating: {
                    Usability: Number,
                    Perfomance: Number,
                    Features: Number,
                    Support: Number,
                    Value: Number,
                    Company: Number,
                },comment:{
                     type :mongoose.Schema.Types.ObjectId,
                     ref : "Comment",
                     required:true
                }

            }
        }
    ],





}, {
    timestamps: true,
    get: time => time.toDateString()
})



module.exports = mongoose.model("user", user)





