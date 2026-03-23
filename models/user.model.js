const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    role: {
        type: String,
        require: true,
        default: "user",
        enum: ["user", "admin"],
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


// PASSWORD HASH
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// PAROLNI TEKSHIRISH
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// TOKEN GENERATE
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            role: this.role
        },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIRE }
    );
};

module.exports = mongoose.model("User", userSchema);