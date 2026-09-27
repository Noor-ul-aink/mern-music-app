const express = require("express");
const { createPlaylist, addSongToPlaylist, getUserPlaylists } = require("../controllers/playlist.controller");
const router = express.Router();

router.post("/", createPlaylist);
router.post("/add-song", addSongToPlaylist);
router.get("/:userId", getUserPlaylists);

module.exports = router;