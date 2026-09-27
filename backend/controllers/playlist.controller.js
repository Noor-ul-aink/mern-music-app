const Playlist = require("../models/Playlist");
const allSongs = require("../utils/songs");

// CREATE PLAYLIST
const createPlaylist = async (req, res, next) => {
    try {
        const { userId, name } = req.body;

        const playlist = new Playlist({
            userId,
            name,
            songs: [],
        });

        await playlist.save();

        res.status(201).json({
            message: "Playlist created",
            playlist,
        });
    } catch (error) {
        next(error);
    }
};

// ADD SONG TO PLAYLIST
const addSongToPlaylist = async (req, res, next) => {
    try {
        const { playlistId, songId } = req.body;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            res.status(404);
            return next(new Error("Playlist not found"));
        }

        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            await playlist.save();
        }

        res.json({ message: "Song added to playlist", playlist });
    } catch (error) {
        next(error);
    }
};

// GET USER PLAYLISTS
const getUserPlaylists = async (req, res, next) => {
    try {
        const playlists = await Playlist.find({
            userId: req.params.userId,
        });

        // Attach song details manually since they are dummy
        const detailedPlaylists = playlists.map(p => {
            const playlistObj = p.toObject();
            playlistObj.songDetails = playlistObj.songs.map(id => allSongs.find(s => s.id === id)).filter(Boolean);
            return playlistObj;
        });

        res.json(detailedPlaylists);
    } catch (error) {
        next(error);
    }
};

module.exports = { createPlaylist, addSongToPlaylist, getUserPlaylists };
