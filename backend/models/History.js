const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    userId: Number,
    songId: Number,
    playedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("History", historySchema);