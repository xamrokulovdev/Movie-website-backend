const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genres: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
        }
    ],
    user_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    thumbnail: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    release_year: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "Uzbekistan",
    },
    language: {
        type: String,
        default: "Uzbek",
    },
    age_limit: {
        type: String,
        default: "16+",
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Movie", movieSchema);