const express = require("express");
const { getRecommendations } = require("../controllers/recommendation.controller");
const router = express.Router();

router.get("/:userId", getRecommendations);

module.exports = router;