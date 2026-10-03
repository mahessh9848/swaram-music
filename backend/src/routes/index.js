const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/musicController');

// Mood routes
router.get('/moods', ctrl.getMoods);
router.get('/moods/:code', ctrl.getMoodByCode);

// Playlist routes
router.get('/playlists/:id', ctrl.getPlaylist);
router.get('/playlists/:id/songs', ctrl.getPlaylistSongs);

// History & Favorites
router.post('/history', ctrl.postHistory);
router.post('/favorites', ctrl.postFavorite);
router.delete('/favorites/:songId', ctrl.deleteFavorite);

module.exports = router;
