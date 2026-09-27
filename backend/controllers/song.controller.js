const songs = require("../utils/songs");

// GET ALL SONGS
const getSongs = (req, res, next) => {
    try {
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

module.exports = { getSongs };
