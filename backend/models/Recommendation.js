const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    userId: Number,
    recommendedSongs: [
        {
            songId: Number,
            score: Number
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Recommendation", recommendationSchema);