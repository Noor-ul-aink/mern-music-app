const express = require("express");
const { getSongs } = require("../controllers/song.controller");
const router = express.Router();

router.get("/", getSongs);

module.exports = router;