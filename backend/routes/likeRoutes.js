const express = require("express");
const { likeSong, getLikedSongs } = require("../controllers/like.controller");
const router = express.Router();

router.post("/", likeSong);
router.get("/:userId", getLikedSongs);

module.exports = router;