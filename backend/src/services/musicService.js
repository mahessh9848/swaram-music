const db = require('../db');

/**
 * In-memory fallback data for when Oracle is not configured or queries fail.
 * This allows the frontend to render without a live database.
 * This is NOT a production data source — it's a development convenience.
 */
const FALLBACK_MOODS = [
  {
    MOOD_ID: 1,
    MOOD_CODE: 'sad',
    MOOD_NAME: 'Sad',
    DESCRIPTION: 'A reflective listening experience for quieter moments.',
  },
];

const FALLBACK_PLAYLISTS = [
  {
    PLAYLIST_ID: 1,
    MOOD_ID: 1,
    PLAYLIST_NAME: 'Suggested for you',
    DESCRIPTION: 'A playlist to match your mood.',
  },
];

/**
 * Get all moods.
 */
async function getAllMoods() {
  if (!db.isConnected()) return FALLBACK_MOODS;
  try {
    const result = await db.execute('SELECT * FROM moods ORDER BY mood_id');
    return result.rows;
  } catch (err) {
    console.warn('[Service] getAllMoods DB query failed, using fallback:', err.message);
    return FALLBACK_MOODS;
  }
}

/**
 * Get a mood by code.
 */
async function getMoodByCode(code) {
  if (!db.isConnected()) {
    return FALLBACK_MOODS.find((m) => m.MOOD_CODE === code) || null;
  }
  try {
    const result = await db.execute(
      'SELECT * FROM moods WHERE mood_code = :code',
      [code]
    );
    return result.rows[0] || FALLBACK_MOODS.find((m) => m.MOOD_CODE === code) || null;
  } catch (err) {
    console.warn('[Service] getMoodByCode DB query failed, using fallback:', err.message);
    return FALLBACK_MOODS.find((m) => m.MOOD_CODE === code) || null;
  }
}

/**
 * Get playlists for a mood.
 */
async function getPlaylistsByMood(moodId) {
  if (!db.isConnected()) {
    return FALLBACK_PLAYLISTS.filter((p) => p.MOOD_ID === moodId);
  }
  try {
    const result = await db.execute(
      'SELECT * FROM playlists WHERE mood_id = :moodId ORDER BY playlist_id',
      [moodId]
    );
    return result.rows;
  } catch (err) {
    console.warn('[Service] getPlaylistsByMood DB query failed, using fallback:', err.message);
    return FALLBACK_PLAYLISTS.filter((p) => p.MOOD_ID === moodId);
  }
}

/**
 * Get a playlist by ID.
 */
async function getPlaylistById(id) {
  if (!db.isConnected()) {
    return FALLBACK_PLAYLISTS.find((p) => p.PLAYLIST_ID === Number(id)) || null;
  }
  try {
    const result = await db.execute(
      'SELECT * FROM playlists WHERE playlist_id = :id',
      [id]
    );
    return result.rows[0] || FALLBACK_PLAYLISTS.find((p) => p.PLAYLIST_ID === Number(id)) || null;
  } catch (err) {
    console.warn('[Service] getPlaylistById DB query failed, using fallback:', err.message);
    return FALLBACK_PLAYLISTS.find((p) => p.PLAYLIST_ID === Number(id)) || null;
  }
}

/**
 * Get songs in a playlist (with source info).
 */
async function getPlaylistSongs(playlistId) {
  if (!db.isConnected()) {
    return []; // No songs seeded without a real database
  }
  try {
    const result = await db.execute(
      `SELECT s.song_id, s.title, s.artist, s.duration,
              ss.source_type, ss.source_url, ss.source_ref_id,
              ps.sort_order
       FROM playlist_songs ps
       JOIN songs s ON ps.song_id = s.song_id
       LEFT JOIN song_sources ss ON s.song_id = ss.song_id
       WHERE ps.playlist_id = :playlistId
       ORDER BY ps.sort_order`,
      [playlistId]
    );
    return result.rows;
  } catch (err) {
    console.warn('[Service] getPlaylistSongs DB query failed:', err.message);
    return [];
  }
}

/**
 * Record listening history.
 */
async function addHistory(userId, songId) {
  if (!db.isConnected()) return { success: false, message: 'Database not connected' };
  try {
    await db.execute(
      'INSERT INTO listening_history (user_id, song_id) VALUES (:userId, :songId)',
      [userId, songId]
    );
    return { success: true };
  } catch (err) {
    console.error('[Service] addHistory DB error:', err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Add a favorite.
 */
async function addFavorite(userId, songId) {
  if (!db.isConnected()) return { success: false, message: 'Database not connected' };
  try {
    await db.execute(
      'INSERT INTO favorites (user_id, song_id) VALUES (:userId, :songId)',
      [userId, songId]
    );
    return { success: true };
  } catch (err) {
    console.error('[Service] addFavorite DB error:', err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Remove a favorite.
 */
async function removeFavorite(songId) {
  if (!db.isConnected()) return { success: false, message: 'Database not connected' };
  try {
    await db.execute(
      'DELETE FROM favorites WHERE song_id = :songId',
      [songId]
    );
    return { success: true };
  } catch (err) {
    console.error('[Service] removeFavorite DB error:', err.message);
    return { success: false, message: err.message };
  }
}

module.exports = {
  getAllMoods,
  getMoodByCode,
  getPlaylistsByMood,
  getPlaylistById,
  getPlaylistSongs,
  addHistory,
  addFavorite,
  removeFavorite,
};
