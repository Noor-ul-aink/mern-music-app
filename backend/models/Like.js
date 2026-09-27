const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    userId: Number,
    songId: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Like", likeSchema);