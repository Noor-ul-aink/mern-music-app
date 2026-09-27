const express = require("express");
const connectMongo = require("./config/dbMongo");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const likeRoutes = require("./routes/likeRoutes");
const historyRoutes = require("./routes/historyRoutes"); 
const recommendationRoutes = require("./routes/recommendationRoutes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Music App Backend is Running");
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Connect Mongo
connectMongo();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});