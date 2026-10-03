-- ====================================================================
-- SWARAM DATABASE SCRIPT: 12_seed_test_data.sql
-- Purpose: Seeds development and testing relational activity data:
--          - User Favorites
--          - Listening History (including anonymous and registered users)
--          - User-Created Custom Playlists and Track Associations
-- Note: These records are strictly for DEVELOPMENT and TESTING.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram development test activity data (favorites, history, user playlists)...;

-- ====================================================================
-- 1. SEED USER FAVORITES
-- Users: 2 (demo_user), 3 (listener_dev)
-- Songs: 1 (Calm), 2 (Chill), 5 (Happy), 7 (Road Trip), 8 (Sad)
-- ====================================================================
PROMPT 1/3 Seeding test user favorites...;

-- Demo User (User 2) Favorites
INSERT INTO FAVORITES (USER_ID, SONG_ID, ADDED_AT)
VALUES (2, 1, SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO FAVORITES (USER_ID, SONG_ID, ADDED_AT)
VALUES (2, 2, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO FAVORITES (USER_ID, SONG_ID, ADDED_AT)
VALUES (2, 5, SYSTIMESTAMP - INTERVAL '5' HOUR);

-- Listener Dev (User 3) Favorites
INSERT INTO FAVORITES (USER_ID, SONG_ID, ADDED_AT)
VALUES (3, 7, SYSTIMESTAMP - INTERVAL '3' DAY);

INSERT INTO FAVORITES (USER_ID, SONG_ID, ADDED_AT)
VALUES (3, 8, SYSTIMESTAMP - INTERVAL '12' HOUR);


-- ====================================================================
-- 2. SEED LISTENING HISTORY
-- Seeded with deterministic IDs 1-6 (sequences start at 100)
-- Mix of registered users, anonymous listening, completed, and partial plays
-- ====================================================================
PROMPT 2/3 Seeding test listening history...;

-- Demo User (User 2) listening to Calm (Mood 3) - fully completed
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (1, 2, 1, 3, SYSTIMESTAMP - INTERVAL '4' HOUR, 'Y', 180);

-- Demo User (User 2) listening to Chill (Mood 6) - fully completed
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (2, 2, 2, 6, SYSTIMESTAMP - INTERVAL '2' HOUR, 'Y', 215);

-- Demo User (User 2) listening to Happy (Mood 2) - partial play (120s of 270s)
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (3, 2, 5, 2, SYSTIMESTAMP - INTERVAL '45' MINUTE, 'N', 120);

-- Listener Dev (User 3) listening to Road Trip (Mood 8) - fully completed
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (4, 3, 7, 8, SYSTIMESTAMP - INTERVAL '6' HOUR, 'Y', 362);

-- Listener Dev (User 3) listening to Sad (Mood 1) - fully completed
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (5, 3, 8, 1, SYSTIMESTAMP - INTERVAL '1' HOUR, 'Y', 277);

-- Anonymous Listener (USER_ID IS NULL) listening to Energetic (Mood 5) - partial play
INSERT INTO LISTENING_HISTORY (HISTORY_ID, USER_ID, SONG_ID, MOOD_ID, STARTED_AT, COMPLETED, LISTENED_SECONDS)
VALUES (6, NULL, 3, 5, SYSTIMESTAMP - INTERVAL '15' MINUTE, 'N', 90);


-- ====================================================================
-- 3. SEED USER CUSTOM PLAYLISTS & PLAYLIST TRACKS
-- Seeded with deterministic IDs 1-2 (sequences start at 100)
-- ====================================================================
PROMPT 3/3 Seeding test user-created playlists and playlist tracks...;

-- User Playlist 1: Demo User's Public Relaxation Playlist
INSERT INTO USER_PLAYLISTS (USER_PLAYLIST_ID, USER_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_PUBLIC)
VALUES (
    1,
    2,
    'My Evening Chill',
    'A relaxing collection for unwinding after work.',
    '/assets/backgrounds/chill.jpg',
    'Y'
);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (1, 1, 1, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (1, 2, 2, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (1, 6, 3, SYSTIMESTAMP - INTERVAL '12' HOUR);


-- User Playlist 2: Listener Dev's Private Late Night Playlist
INSERT INTO USER_PLAYLISTS (USER_PLAYLIST_ID, USER_ID, PLAYLIST_NAME, DESCRIPTION, COVER_PATH, IS_PUBLIC)
VALUES (
    2,
    3,
    'Night Drives',
    'Late night soundtrack for solitary journeys.',
    '/assets/backgrounds/roadtrip.jpg',
    'N'
);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (2, 7, 1, SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (2, 8, 2, SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO USER_PLAYLIST_SONGS (USER_PLAYLIST_ID, SONG_ID, TRACK_NUMBER, ADDED_AT)
VALUES (2, 6, 3, SYSTIMESTAMP - INTERVAL '1' DAY);

COMMIT;

PROMPT Swaram development test activity data seeded successfully.;
SET FEEDBACK ON;
