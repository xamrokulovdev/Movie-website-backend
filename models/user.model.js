const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,  
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        }
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);