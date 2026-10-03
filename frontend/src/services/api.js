const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

/**
 * Fetch all moods.
 */
export async function fetchMoods() {
  const res = await fetch(`${API_BASE}/moods`);
  if (!res.ok) throw new Error('Failed to fetch moods');
  return res.json();
}

/**
 * Fetch a specific mood by code (e.g. 'sad').
 */
export async function fetchMoodByCode(code) {
  const res = await fetch(`${API_BASE}/moods/${code}`);
  if (!res.ok) throw new Error(`Failed to fetch mood: ${code}`);
  return res.json();
}

/**
 * Fetch a playlist by ID.
 */
export async function fetchPlaylist(id) {
  const res = await fetch(`${API_BASE}/playlists/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch playlist: ${id}`);
  return res.json();
}

/**
 * Fetch songs within a playlist.
 */
export async function fetchPlaylistSongs(id) {
  const res = await fetch(`${API_BASE}/playlists/${id}/songs`);
  if (!res.ok) throw new Error(`Failed to fetch songs for playlist: ${id}`);
  return res.json();
}

/**
 * Post a listening history entry.
 */
export async function postHistory(userId, songId) {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, songId }),
  });
  if (!res.ok) throw new Error('Failed to record history');
  return res.json();
}

/**
 * Add a song to favorites.
 */
export async function addFavorite(userId, songId) {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, songId }),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

/**
 * Remove a song from favorites.
 */
export async function removeFavorite(songId) {
  const res = await fetch(`${API_BASE}/favorites/${songId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}
