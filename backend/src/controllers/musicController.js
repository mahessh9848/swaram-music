const musicService = require('../services/musicService');

// GET /api/moods
async function getMoods(req, res) {
  try {
    const moods = await musicService.getAllMoods();
    res.json(moods);
  } catch (err) {
    console.error('[Controller] getMoods error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/moods/:code
async function getMoodByCode(req, res) {
  try {
    const mood = await musicService.getMoodByCode(req.params.code);
    if (!mood) return res.status(404).json({ error: 'Mood not found' });
    
    // Also fetch playlists for this mood
    const playlists = await musicService.getPlaylistsByMood(mood.MOOD_ID);
    res.json({ ...mood, playlists });
  } catch (err) {
    console.error('[Controller] getMoodByCode error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/playlists/:id
async function getPlaylist(req, res) {
  try {
    const playlist = await musicService.getPlaylistById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    console.error('[Controller] getPlaylist error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/playlists/:id/songs
async function getPlaylistSongs(req, res) {
  try {
    const songs = await musicService.getPlaylistSongs(req.params.id);
    res.json(songs);
  } catch (err) {
    console.error('[Controller] getPlaylistSongs error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/history
async function postHistory(req, res) {
  try {
    const { userId, songId } = req.body;
    if (!userId || !songId) {
      return res.status(400).json({ error: 'userId and songId are required' });
    }
    const result = await musicService.addHistory(userId, songId);
    res.json(result);
  } catch (err) {
    console.error('[Controller] postHistory error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/favorites
async function postFavorite(req, res) {
  try {
    const { userId, songId } = req.body;
    if (!userId || !songId) {
      return res.status(400).json({ error: 'userId and songId are required' });
    }
    const result = await musicService.addFavorite(userId, songId);
    res.json(result);
  } catch (err) {
    console.error('[Controller] postFavorite error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/favorites/:songId
async function deleteFavorite(req, res) {
  try {
    const result = await musicService.removeFavorite(req.params.songId);
    res.json(result);
  } catch (err) {
    console.error('[Controller] deleteFavorite error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getMoods,
  getMoodByCode,
  getPlaylist,
  getPlaylistSongs,
  postHistory,
  postFavorite,
  deleteFavorite,
};
