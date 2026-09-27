const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    userId: Number,
    name: String,
    songs: [Number], // song IDs from MySQL
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Playlist", playlistSchema);