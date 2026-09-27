const Like = require("../models/Like");
const db = require("../config/dbMySQL");

// GET RECOMMENDATIONS
const getRecommendations = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // 1. Get liked songs from MongoDB
        const likes = await Like.find({ userId });

        if (likes.length === 0) {
            return res.json([]);
        }

        // 2. Extract song IDs
        const songIds = likes.map(like => like.songId);

        // 3. Get songs from MySQL
        const query = `
            SELECT * FROM songs
            WHERE id IN (?)
        `;

        db.query(query, [songIds], (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.length === 0) {
                return res.json([]);
            }

            // 4. Get artists of liked songs
            const artists = results.map(song => song.artist);

            // 5. Recommend songs from same artists
            const recQuery = `
                SELECT * FROM songs
                WHERE artist IN (?)
                LIMIT 10
            `;

            db.query(recQuery, [artists], (err, recommendations) => {
                if (err) {
                    return next(err);
                }

                res.json(recommendations);
            });
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getRecommendations };
