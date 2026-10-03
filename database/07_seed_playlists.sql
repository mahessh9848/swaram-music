-- ====================================================================
-- SWARAM DATABASE SCRIPT: 07_seed_playlists.sql
-- Purpose: Seeds system-curated playlists (at least 2 per mood = 16 playlists).
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram curated playlists (16 playlists)...;

-- 1. SAD Playlists (Mood 1)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (1, 1, 'Rainy Night Reflections', 'Gentle, contemplative melodies for rainy evenings.', '/assets/backgrounds/sad.png', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (2, 1, 'Quiet Hours', 'Soft acoustics and minimal tones for deep reflection.', '/assets/backgrounds/sad.png', 'Y', 'Y');

-- 2. HAPPY Playlists (Mood 2)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (3, 2, 'Golden Hour', 'Warm acoustic rhythms and uplifting sunshine vibes.', '/assets/backgrounds/happy.png', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (4, 2, 'Brighter Days', 'Energetic feel-good tracks to celebrate life.', '/assets/backgrounds/happy.png', 'Y', 'Y');

-- 3. CALM Playlists (Mood 3)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (5, 3, 'Quiet Moments', 'Peaceful ambience and restorative instrumental flow.', '/assets/backgrounds/calm.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (6, 3, 'Slow Evenings', 'Soothing piano and strings to ease the day away.', '/assets/backgrounds/calm.jpg', 'Y', 'Y');

-- 4. ROMANTIC Playlists (Mood 4)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (7, 4, 'For Two', 'Intimate melodies crafted for shared memories.', '/assets/backgrounds/romantic.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (8, 4, 'Afterglow', 'Warm candlelit chords and tender harmonies.', '/assets/backgrounds/romantic.jpg', 'Y', 'Y');

-- 5. ENERGETIC Playlists (Mood 5)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (9, 5, 'Full Energy', 'High-tempo driving beats to fuel your focus and workout.', '/assets/backgrounds/energetic.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (10, 5, 'Keep Moving', 'Dynamic rhythms and upbeat momentum for your day.', '/assets/backgrounds/energetic.jpg', 'Y', 'Y');

-- 6. CHILL Playlists (Mood 6)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (11, 6, 'Easy Listening', 'Laid-back mellow beats for unwinding without haste.', '/assets/backgrounds/chill.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (12, 6, 'Slow Weekend', 'Relaxed grooves and afternoon coffee vibes.', '/assets/backgrounds/chill.jpg', 'Y', 'Y');

-- 7. LONELY Playlists (Mood 7)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (13, 7, 'After Midnight', 'Nocturnal soundscapes for introspective thoughts.', '/assets/backgrounds/lonely.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (14, 7, 'Between Thoughts', 'Quiet instrumental echoes that keep you company.', '/assets/backgrounds/lonely.jpg', 'Y', 'Y');

-- 8. ROAD TRIP Playlists (Mood 8)
INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (15, 8, 'Open Road', 'Sweeping highway tracks for open horizons.', '/assets/backgrounds/roadtrip.jpg', 'Y', 'Y');

INSERT INTO PLAYLISTS (PLAYLIST_ID, MOOD_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_SYSTEM, IS_ACTIVE)
VALUES (16, 8, 'Long Way Home', 'Nostalgic melodies for the journey across the sunset.', '/assets/backgrounds/roadtrip.jpg', 'Y', 'Y');

COMMIT;

PROMPT Swaram playlists seeded successfully (16 playlists).;
SET FEEDBACK ON;
