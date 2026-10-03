import { MOODS } from './moods';

/**
 * Direct access to all songs indexed by mood.
 */
export const SONGS_BY_MOOD = MOODS.reduce((acc, mood) => {
  acc[mood.id] = mood.playlist.songs;
  return acc;
}, {});

/**
 * Get all songs across all moods.
 */
export const ALL_SONGS = MOODS.flatMap((mood) =>
  mood.playlist.songs.map((song) => ({
    ...song,
    moodId: mood.id,
    moodName: mood.name,
  }))
);
