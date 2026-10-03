-- ====================================================================
-- SWARAM DATABASE SCRIPT: 09_seed_songs.sql
-- Purpose: Seeds real artists, albums, songs, sources, and artist links.
-- Source: Real audio files discovered in C:\Users\mamid\OneDrive\Desktop\Projects\swaram\songs.
-- Note: Zero fabricated songs or placeholder WAVs are seeded.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram real artists, albums, songs, and sources...;

-- 1. PRIMARY ARTIST: Swaram
INSERT INTO ARTISTS (ARTIST_ID, ARTIST_NAME, COUNTRY)
VALUES (1, 'Swaram', 'India');

-- 2. ALBUM: Swaram Originals
INSERT INTO ALBUMS (ALBUM_ID, ALBUM_TITLE, ARTIST_ID, RELEASE_YEAR, ARTWORK_PATH)
VALUES (1, 'Swaram Originals', 1, 2026, '/assets/backgrounds/sad.png');

-- 3. SONGS (Exact 8 real songs from swaram/songs with measured durations)

-- Song 1: Calm (calm.mp3 - 180s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (1, 'Calm', 1, 180, 2026, 'Instrumental', '/assets/backgrounds/calm.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (1, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (1, 1, 'LOCAL_MP3', '/audio/calm.mp3', 'Y');

-- Song 2: Chill (chill.mp3 - 215s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (2, 'Chill', 1, 215, 2026, 'Instrumental', '/assets/backgrounds/chill.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (2, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (2, 2, 'LOCAL_MP3', '/audio/chill.mp3', 'Y');

-- Song 3: Energetic (energytic.mp3 - 145s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (3, 'Energetic', 1, 145, 2026, 'Instrumental', '/assets/backgrounds/energetic.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (3, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (3, 3, 'LOCAL_MP3', '/audio/energetic.mp3', 'Y');

-- Song 4: Energetic 2 (energytic 2.mp3 - 297s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (4, 'Energetic 2', 1, 297, 2026, 'Instrumental', '/assets/backgrounds/energetic.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (4, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (4, 4, 'LOCAL_MP3', '/audio/energetic2.mp3', 'Y');

-- Song 5: Happy (happy.mp3 - 270s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (5, 'Happy', 1, 270, 2026, 'Instrumental', '/assets/backgrounds/happy.png', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (5, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (5, 5, 'LOCAL_MP3', '/audio/happy.mp3', 'Y');

-- Song 6: Lonely (lonely.mp3 - 245s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (6, 'Lonely', 1, 245, 2026, 'Instrumental', '/assets/backgrounds/lonely.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (6, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (6, 6, 'LOCAL_MP3', '/audio/lonely.mp3', 'Y');

-- Song 7: Road Trip (roadtrip.mp3 - 362s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (7, 'Road Trip', 1, 362, 2026, 'Instrumental', '/assets/backgrounds/roadtrip.jpg', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (7, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (7, 7, 'LOCAL_MP3', '/audio/roadtrip.mp3', 'Y');

-- Song 8: Sad (sad.mp3 - 277s)
INSERT INTO SONGS (SONG_ID, TITLE, ALBUM_ID, DURATION_SECONDS, RELEASE_YEAR, LANGUAGE, ARTWORK_PATH, IS_ACTIVE, UPLOADED_BY)
VALUES (8, 'Sad', 1, 277, 2026, 'Instrumental', '/assets/backgrounds/sad.png', 'Y', 1);

INSERT INTO SONG_ARTISTS (SONG_ID, ARTIST_ID, ARTIST_ROLE)
VALUES (8, 1, 'PRIMARY');

INSERT INTO SONG_SOURCES (SOURCE_ID, SONG_ID, SOURCE_TYPE, SOURCE_REFERENCE, IS_PRIMARY)
VALUES (8, 8, 'LOCAL_MP3', '/audio/sad.mp3', 'Y');

COMMIT;

PROMPT Swaram real songs seeded successfully (8 real songs).;
SET FEEDBACK ON;
