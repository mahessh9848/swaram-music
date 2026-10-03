-- ====================================================================
-- SWARAM DATABASE SCRIPT: 11_seed_playlist_songs.sql
-- Purpose: Associates real songs with system playlists with strict track numbers.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding playlist-to-song mappings...;

-- 1. SAD Playlists (Mood 1)
-- Playlist 1: Rainy Night Reflections (Song 8: Sad)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (1, 8, 1);

-- Playlist 2: Quiet Hours (Song 8: Sad, Song 6: Lonely)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (2, 8, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (2, 6, 2);

-- 2. HAPPY Playlists (Mood 2)
-- Playlist 3: Golden Hour (Song 5: Happy)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (3, 5, 1);

-- Playlist 4: Brighter Days (Song 5: Happy, Song 7: Road Trip)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (4, 5, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (4, 7, 2);

-- 3. CALM Playlists (Mood 3)
-- Playlist 5: Quiet Moments (Song 1: Calm)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (5, 1, 1);

-- Playlist 6: Slow Evenings (Song 1: Calm, Song 2: Chill)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (6, 1, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (6, 2, 2);

-- 4. ROMANTIC Playlists (Mood 4)
-- Reserved empty for user-imported MP3 library tracks

-- 5. ENERGETIC Playlists (Mood 5)
-- Playlist 9: Full Energy (Song 3: Energetic, Song 4: Energetic 2)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (9, 3, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (9, 4, 2);

-- Playlist 10: Keep Moving (Song 4: Energetic 2, Song 3: Energetic)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (10, 4, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (10, 3, 2);

-- 6. CHILL Playlists (Mood 6)
-- Playlist 11: Easy Listening (Song 2: Chill)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (11, 2, 1);

-- Playlist 12: Slow Weekend (Song 2: Chill, Song 1: Calm)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (12, 2, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (12, 1, 2);

-- 7. LONELY Playlists (Mood 7)
-- Playlist 13: After Midnight (Song 6: Lonely)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (13, 6, 1);

-- Playlist 14: Between Thoughts (Song 6: Lonely, Song 8: Sad)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (14, 6, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (14, 8, 2);

-- 8. ROAD TRIP Playlists (Mood 8)
-- Playlist 15: Open Road (Song 7: Road Trip)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (15, 7, 1);

-- Playlist 16: Long Way Home (Song 7: Road Trip, Song 4: Energetic 2)
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (16, 7, 1);
INSERT INTO PLAYLIST_SONGS (PLAYLIST_ID, SONG_ID, TRACK_NUMBER) VALUES (16, 4, 2);

COMMIT;

PROMPT Swaram playlist-to-song mappings seeded successfully.;
SET FEEDBACK ON;
