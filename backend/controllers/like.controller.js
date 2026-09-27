const Like = require("../models/Like");

// LIKE SONG
const likeSong = async (req, res, next) => {
    try {
        const { userId, songId } = req.body;

        const existing = await Like.findOne({ userId, songId });

        if (existing) {
            return res.json({ message: "Already liked" });
        }

        const like = new Like({ userId, songId });
        await like.save();

        res.status(201).json({ message: "Song liked ❤️" });

    } catch (error) {
        next(error);
    }
};

// GET LIKED SONGS
const getLikedSongs = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const liked = await Like.find({ userId });
        res.json(liked);
    } catch (error) {
        next(error);
    }
};

module.exports = { likeSong, getLikedSongs };
