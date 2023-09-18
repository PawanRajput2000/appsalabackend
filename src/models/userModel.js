const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
    },
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "App",
            status: {
                type: String,
                enum: ["I am using it 👍", "Yes, I want to 🤩", "No, I don't 😑", "Maybe 🤔"],
                default: 'Maybe 🤔',
            },
            comment: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "comment",
                    required: true,
                },
            ],
            user_ratings: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "rating",
                    required: true,
                },
            ],
        },
    ],
    following_app: [
        {
            obj_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "App",
            },
            status: {
                type: String,
                enum: ["I am using it 👍", "Yes, I want to 🤩", "No, I don't 😑", "Maybe 🤔"],
                default: 'Maybe 🤔',
            },
            subscription: {
                date: {
                    type: Date,
                    default: Date.now,
                },
                amount: {
                    type: Number,
                    required: true,
                    default: 0,
                },
                duration: {
                    type: String,
                    required: true,
                },
                package: {
                    type: String,
                    default: "trying",
                },
                comment: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "comment",
                        required: true,
                    },
                ],
                user_ratings: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "rating",
                        required: true,
                    },
                ],
            },
        },
    ],
}, {
    timestamps: true,
    toJSON: { getters: true } // This ensures the timestamps are returned as strings.
});
module.exports = mongoose.model("user", user)

