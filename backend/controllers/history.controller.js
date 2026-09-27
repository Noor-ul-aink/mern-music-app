const History = require("../models/History");

// SAVE HISTORY
const saveHistory = async (req, res, next) => {
    try {
        const { userId, songId } = req.body;

        const history = new History({ userId, songId });
        await history.save();

        res.status(201).json({ message: "History saved" });

    } catch (error) {
        next(error);
    }
};

// GET USER HISTORY
const getUserHistory = async (req, res, next) => {
    try {
        const history = await History.find({ userId: req.params.userId })
            .sort({ playedAt: -1 })
            .limit(10);

        res.json(history);

    } catch (error) {
        next(error);
    }
};

module.exports = { saveHistory, getUserHistory };
