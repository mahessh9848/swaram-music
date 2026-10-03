-- ====================================================================
-- SWARAM DATABASE SCRIPT: 13_create_views.sql
-- Purpose: Creates production relational views to simplify backend queries
--          for Node.js / Express API consumption.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Creating Swaram application views...;

-- ====================================================================
-- 1. VW_SONG_DETAILS
-- Consolidates song metadata, primary artist, album, and audio source
-- ====================================================================
CREATE OR REPLACE VIEW VW_SONG_DETAILS AS
SELECT
    s.SONG_ID,
    s.TITLE,
    s.ALBUM_ID,
    al.ALBUM_TITLE,
    ar.ARTIST_ID AS PRIMARY_ARTIST_ID,
    NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
    s.DURATION_SECONDS,
    s.RELEASE_YEAR,
    s.LANGUAGE,
    s.ARTWORK_PATH,
    s.IS_ACTIVE,
    ss.SOURCE_TYPE,
    ss.SOURCE_REFERENCE,
    s.CREATED_AT
FROM SONGS s
LEFT JOIN ALBUMS al 
    ON s.ALBUM_ID = al.ALBUM_ID
LEFT JOIN SONG_ARTISTS sa 
    ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar 
    ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss 
    ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y';

PROMPT 1/5 Created view: VW_SONG_DETAILS;

-- ====================================================================
-- 2. VW_MOOD_SONGS
-- Maps songs to their mood classifications with relevance ranking
-- ====================================================================
CREATE OR REPLACE VIEW VW_MOOD_SONGS AS
SELECT
    m.MOOD_ID,
    m.MOOD_CODE,
    m.MOOD_NAME,
    s.SONG_ID,
    s.TITLE,
    NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
    s.DURATION_SECONDS,
    s.ARTWORK_PATH,
    ss.SOURCE_TYPE,
    ss.SOURCE_REFERENCE,
    sm.RELEVANCE,
    s.IS_ACTIVE
FROM SONG_MOODS sm
JOIN MOODS m 
    ON sm.MOOD_ID = m.MOOD_ID
JOIN SONGS s 
    ON sm.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa 
    ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar 
    ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss 
    ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y';

PROMPT 2/5 Created view: VW_MOOD_SONGS;

-- ====================================================================
-- 3. VW_PLAYLIST_SONGS
-- Exposes curated system playlists and their ordered track listings
-- ====================================================================
CREATE OR REPLACE VIEW VW_PLAYLIST_SONGS AS
SELECT
    p.PLAYLIST_ID,
    p.PLAYLIST_NAME,
    p.DESCRIPTION AS PLAYLIST_DESCRIPTION,
    p.COVER_PATH AS PLAYLIST_COVER,
    p.IS_SYSTEM,
    p.IS_ACTIVE AS PLAYLIST_ACTIVE,
    m.MOOD_ID,
    m.MOOD_CODE,
    m.MOOD_NAME,
    ps.TRACK_NUMBER,
    s.SONG_ID,
    s.TITLE,
    NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
    s.DURATION_SECONDS,
    s.ARTWORK_PATH AS SONG_ARTWORK,
    ss.SOURCE_TYPE,
    ss.SOURCE_REFERENCE
FROM PLAYLIST_SONGS ps
JOIN PLAYLISTS p 
    ON ps.PLAYLIST_ID = p.PLAYLIST_ID
JOIN MOODS m 
    ON p.MOOD_ID = m.MOOD_ID
JOIN SONGS s 
    ON ps.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa 
    ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar 
    ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss 
    ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y';

PROMPT 3/5 Created view: VW_PLAYLIST_SONGS;

-- ====================================================================
-- 4. VW_USER_HISTORY
-- Exposes chronological listening history for registered and anonymous users
-- ====================================================================
CREATE OR REPLACE VIEW VW_USER_HISTORY AS
SELECT
    lh.HISTORY_ID,
    lh.USER_ID,
    NVL(u.USERNAME, 'Anonymous') AS USERNAME,
    lh.SONG_ID,
    s.TITLE,
    NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
    lh.MOOD_ID,
    m.MOOD_NAME,
    lh.STARTED_AT,
    lh.COMPLETED,
    lh.LISTENED_SECONDS,
    s.DURATION_SECONDS AS TOTAL_DURATION_SECONDS
FROM LISTENING_HISTORY lh
LEFT JOIN USERS u 
    ON lh.USER_ID = u.USER_ID
JOIN SONGS s 
    ON lh.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa 
    ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar 
    ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN MOODS m 
    ON lh.MOOD_ID = m.MOOD_ID;

PROMPT 4/5 Created view: VW_USER_HISTORY;

-- ====================================================================
-- 5. VW_USER_FAVORITES
-- Exposes all user favorited songs with full audio & artist details
-- ====================================================================
CREATE OR REPLACE VIEW VW_USER_FAVORITES AS
SELECT
    f.USER_ID,
    u.USERNAME,
    f.SONG_ID,
    s.TITLE,
    NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
    s.DURATION_SECONDS,
    s.ARTWORK_PATH,
    ss.SOURCE_TYPE,
    ss.SOURCE_REFERENCE,
    f.ADDED_AT
FROM FAVORITES f
JOIN USERS u 
    ON f.USER_ID = u.USER_ID
JOIN SONGS s 
    ON f.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa 
    ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar 
    ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss 
    ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y';

PROMPT 5/5 Created view: VW_USER_FAVORITES;

PROMPT Swaram views created successfully (5 views).;
SET FEEDBACK ON;
