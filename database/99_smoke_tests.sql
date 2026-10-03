-- ====================================================================
-- SWARAM DATABASE SCRIPT: 99_smoke_tests.sql
-- Purpose: Exhaustive smoke tests, verification queries, integrity audits,
--          and sample application queries for the Swaram schema.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET LINESIZE 140;
SET PAGESIZE 100;
SET FEEDBACK OFF;
SET ECHO OFF;
SET HEADING ON;
SET DEFINE OFF;
SET SERVEROUTPUT ON SIZE 1000000;

PROMPT ;
PROMPT ====================================================================;
PROMPT                  SWARAM DATABASE VERIFICATION SUITE                  ;
PROMPT ====================================================================;

-- ====================================================================
-- TEST 1: CORE ENTITY COUNT AUDIT
-- Expected:
--   MOODS: 8
--   PLAYLISTS: 16 (2 per mood)
--   SONGS: 8 (Real MP3 files)
--   ARTISTS: 1 (Swaram)
--   ALBUMS: 1 (Swaram Originals)
--   USERS: 3 (admin, demo_user, listener_dev)
--   USER_PREFERENCES: 3
--   SONG_SOURCES: 8 (LOCAL_MP3)
--   SONG_ARTISTS: 8
--   SONG_MOODS: >= 8 (includes cross-over moods)
--   PLAYLIST_SONGS: >= 8 tracks
--   FAVORITES: 5
--   LISTENING_HISTORY: >= 6
--   USER_PLAYLISTS: 2
--   USER_PLAYLIST_SONGS: 6
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 1] ENTITY RECORD COUNTS                                      ;
PROMPT --------------------------------------------------------------------;

COLUMN TABLE_NAME FORMAT A25 HEADING 'Table Name';
COLUMN RECORD_COUNT FORMAT 99,999 HEADING 'Count';
COLUMN EXPECTED FORMAT A20 HEADING 'Expected Spec';
COLUMN STATUS FORMAT A10 HEADING 'Status';

SELECT 'MOODS' AS TABLE_NAME, COUNT(*) AS RECORD_COUNT, '8 moods' AS EXPECTED,
       CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END AS STATUS FROM MOODS
UNION ALL
SELECT 'PLAYLISTS', COUNT(*), '16 playlists',
       CASE WHEN COUNT(*) = 16 THEN 'PASS' ELSE 'FAIL' END FROM PLAYLISTS
UNION ALL
SELECT 'SONGS', COUNT(*), '8 real songs',
       CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END FROM SONGS
UNION ALL
SELECT 'ARTISTS', COUNT(*), '>= 1 artist',
       CASE WHEN COUNT(*) >= 1 THEN 'PASS' ELSE 'FAIL' END FROM ARTISTS
UNION ALL
SELECT 'ALBUMS', COUNT(*), '>= 1 album',
       CASE WHEN COUNT(*) >= 1 THEN 'PASS' ELSE 'FAIL' END FROM ALBUMS
UNION ALL
SELECT 'USERS', COUNT(*), '3 test users',
       CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END FROM USERS
UNION ALL
SELECT 'USER_PREFERENCES', COUNT(*), '3 preferences',
       CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END FROM USER_PREFERENCES
UNION ALL
SELECT 'SONG_SOURCES', COUNT(*), '8 sources',
       CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END FROM SONG_SOURCES
UNION ALL
SELECT 'SONG_ARTISTS', COUNT(*), '8 relations',
       CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END FROM SONG_ARTISTS
UNION ALL
SELECT 'SONG_MOODS', COUNT(*), '>= 8 mappings',
       CASE WHEN COUNT(*) >= 8 THEN 'PASS' ELSE 'FAIL' END FROM SONG_MOODS
UNION ALL
SELECT 'PLAYLIST_SONGS', COUNT(*), '>= 8 tracks',
       CASE WHEN COUNT(*) >= 8 THEN 'PASS' ELSE 'FAIL' END FROM PLAYLIST_SONGS
UNION ALL
SELECT 'FAVORITES', COUNT(*), '5 favorites',
       CASE WHEN COUNT(*) = 5 THEN 'PASS' ELSE 'FAIL' END FROM FAVORITES
UNION ALL
SELECT 'LISTENING_HISTORY', COUNT(*), '>= 6 records',
       CASE WHEN COUNT(*) >= 6 THEN 'PASS' ELSE 'FAIL' END FROM LISTENING_HISTORY
UNION ALL
SELECT 'USER_PLAYLISTS', COUNT(*), '2 playlists',
       CASE WHEN COUNT(*) = 2 THEN 'PASS' ELSE 'FAIL' END FROM USER_PLAYLISTS
UNION ALL
SELECT 'USER_PLAYLIST_SONGS', COUNT(*), '6 tracks',
       CASE WHEN COUNT(*) = 6 THEN 'PASS' ELSE 'FAIL' END FROM USER_PLAYLIST_SONGS;


-- ====================================================================
-- TEST 2: ALL 8 SWARAM MOODS VERIFICATION
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 2] ALL 8 SWARAM MOODS AND DISPLAY ORDERS                     ;
PROMPT --------------------------------------------------------------------;

COLUMN MOOD_ID FORMAT 99 HEADING 'ID';
COLUMN MOOD_CODE FORMAT A12 HEADING 'Code';
COLUMN MOOD_NAME FORMAT A12 HEADING 'Mood Name';
COLUMN DISPLAY_ORDER FORMAT 99 HEADING 'Order';
COLUMN IS_ACTIVE FORMAT A6 HEADING 'Active';
COLUMN DESCRIPTION FORMAT A45 HEADING 'Description';

SELECT MOOD_ID, MOOD_CODE, MOOD_NAME, DISPLAY_ORDER, IS_ACTIVE, DESCRIPTION
FROM MOODS
ORDER BY DISPLAY_ORDER;


-- ====================================================================
-- TEST 3: REAL SONGS AUDIT (From swaram/songs)
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 3] REAL SONGS DISCOVERED and SEEDED AUDIT                     ;
PROMPT --------------------------------------------------------------------;

COLUMN SONG_ID FORMAT 99 HEADING 'ID';
COLUMN TITLE FORMAT A16 HEADING 'Song Title';
COLUMN PRIMARY_ARTIST_NAME FORMAT A15 HEADING 'Artist';
COLUMN DURATION_SECONDS FORMAT 999 HEADING 'Sec';
COLUMN SOURCE_TYPE FORMAT A10 HEADING 'Source';
COLUMN SOURCE_REFERENCE FORMAT A28 HEADING 'Reference Path';

SELECT s.SONG_ID, s.TITLE, NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
       s.DURATION_SECONDS, ss.SOURCE_TYPE, ss.SOURCE_REFERENCE
FROM SONGS s
LEFT JOIN SONG_ARTISTS sa ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y'
ORDER BY s.SONG_ID;


-- ====================================================================
-- TEST 4: SYSTEM PLAYLISTS PER MOOD DISTRIBUTION
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 4] SYSTEM PLAYLIST DISTRIBUTION PER MOOD (Target: 2 each)    ;
PROMPT --------------------------------------------------------------------;

COLUMN MOOD_CODE FORMAT A15 HEADING 'Mood Code';
COLUMN PLAYLIST_COUNT FORMAT 99 HEADING 'Playlists';
COLUMN STATUS FORMAT A10 HEADING 'Status';

SELECT m.MOOD_CODE, COUNT(p.PLAYLIST_ID) AS PLAYLIST_COUNT,
       CASE WHEN COUNT(p.PLAYLIST_ID) = 2 THEN 'PASS' ELSE 'FAIL' END AS STATUS
FROM MOODS m
LEFT JOIN PLAYLISTS p ON m.MOOD_ID = p.MOOD_ID
GROUP BY m.MOOD_CODE, m.DISPLAY_ORDER
ORDER BY m.DISPLAY_ORDER;


-- ====================================================================
-- TEST 5: SONGS MAPPED TO 'SAD' MOOD
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 5] QUERY: ALL SONGS FOR 'SAD' MOOD                           ;
PROMPT --------------------------------------------------------------------;

COLUMN TITLE FORMAT A20 HEADING 'Song Title';
COLUMN PRIMARY_ARTIST_NAME FORMAT A15 HEADING 'Artist';
COLUMN RELEVANCE FORMAT 0.99 HEADING 'Relevance';
COLUMN DURATION_SECONDS FORMAT 999 HEADING 'Sec';

SELECT s.TITLE, NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
       sm.RELEVANCE, s.DURATION_SECONDS, ss.SOURCE_REFERENCE
FROM SONG_MOODS sm
JOIN MOODS m ON sm.MOOD_ID = m.MOOD_ID
JOIN SONGS s ON sm.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y'
WHERE m.MOOD_CODE = 'SAD'
ORDER BY sm.RELEVANCE DESC;


-- ====================================================================
-- TEST 6: SONGS MAPPED TO 'HAPPY' MOOD
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 6] QUERY: ALL SONGS FOR 'HAPPY' MOOD                         ;
PROMPT --------------------------------------------------------------------;

SELECT s.TITLE, NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
       sm.RELEVANCE, s.DURATION_SECONDS, ss.SOURCE_REFERENCE
FROM SONG_MOODS sm
JOIN MOODS m ON sm.MOOD_ID = m.MOOD_ID
JOIN SONGS s ON sm.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y'
WHERE m.MOOD_CODE = 'HAPPY'
ORDER BY sm.RELEVANCE DESC;


-- ====================================================================
-- TEST 7: SONGS IN PLAYLIST 1 ('Rainy Night Reflections')
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 7] QUERY: SONGS IN PLAYLIST 1 (Rainy Night Reflections)      ;
PROMPT --------------------------------------------------------------------;

COLUMN PLAYLIST_NAME FORMAT A25 HEADING 'Playlist';
COLUMN TRACK_NUMBER FORMAT 99 HEADING 'Trk';

SELECT p.PLAYLIST_NAME, ps.TRACK_NUMBER, s.TITLE,
       NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME, s.DURATION_SECONDS
FROM PLAYLIST_SONGS ps
JOIN PLAYLISTS p ON ps.PLAYLIST_ID = p.PLAYLIST_ID
JOIN SONGS s ON ps.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar ON sa.ARTIST_ID = ar.ARTIST_ID
WHERE ps.PLAYLIST_ID = 1
ORDER BY ps.TRACK_NUMBER;


-- ====================================================================
-- TEST 8: USER FAVORITES FOR DEMO USER (User ID = 2)
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 8] QUERY: FAVORITES FOR USER 2 (demo_user)                   ;
PROMPT --------------------------------------------------------------------;

COLUMN USERNAME FORMAT A15 HEADING 'Username';

SELECT u.USERNAME, s.TITLE, NVL(ar.ARTIST_NAME, 'Unknown Artist') AS PRIMARY_ARTIST_NAME,
       s.DURATION_SECONDS, ss.SOURCE_REFERENCE
FROM FAVORITES f
JOIN USERS u ON f.USER_ID = u.USER_ID
JOIN SONGS s ON f.SONG_ID = s.SONG_ID
LEFT JOIN SONG_ARTISTS sa ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
LEFT JOIN ARTISTS ar ON sa.ARTIST_ID = ar.ARTIST_ID
LEFT JOIN SONG_SOURCES ss ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y'
WHERE f.USER_ID = 2
ORDER BY s.SONG_ID;


-- ====================================================================
-- TEST 9: LISTENING HISTORY
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 9] QUERY: LISTENING HISTORY (Registered and Anonymous)        ;
PROMPT --------------------------------------------------------------------;

COLUMN USERNAME FORMAT A15 HEADING 'User';
COLUMN MOOD_NAME FORMAT A12 HEADING 'Mood';
COLUMN COMPLETED FORMAT A5 HEADING 'Done';
COLUMN LISTENED_SECONDS FORMAT 999 HEADING 'Sec';

SELECT lh.HISTORY_ID, NVL(u.USERNAME, 'Anonymous') AS USERNAME,
       s.TITLE, m.MOOD_NAME, lh.COMPLETED, lh.LISTENED_SECONDS
FROM LISTENING_HISTORY lh
LEFT JOIN USERS u ON lh.USER_ID = u.USER_ID
JOIN SONGS s ON lh.SONG_ID = s.SONG_ID
LEFT JOIN MOODS m ON lh.MOOD_ID = m.MOOD_ID
ORDER BY lh.HISTORY_ID;


-- ====================================================================
-- TEST 10: FOREIGN KEY INTEGRITY CHECK (Orphan Check)
-- All should return 0 orphans.
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 10] REFERENTIAL INTEGRITY AUDIT (Orphan Detection)           ;
PROMPT --------------------------------------------------------------------;

COLUMN CHECK_DESCRIPTION FORMAT A45 HEADING 'Integrity Rule';
COLUMN ORPHANS FORMAT 999 HEADING 'Orphans';
COLUMN STATUS FORMAT A10 HEADING 'Status';

SELECT 'Song Sources without parent Song' AS CHECK_DESCRIPTION,
       COUNT(*) AS ORPHANS,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS STATUS
FROM SONG_SOURCES ss LEFT JOIN SONGS s ON ss.SONG_ID = s.SONG_ID WHERE s.SONG_ID IS NULL
UNION ALL
SELECT 'Song Moods without parent Song', COUNT(*),
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END
FROM SONG_MOODS sm LEFT JOIN SONGS s ON sm.SONG_ID = s.SONG_ID WHERE s.SONG_ID IS NULL
UNION ALL
SELECT 'Song Moods without parent Mood', COUNT(*),
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END
FROM SONG_MOODS sm LEFT JOIN MOODS m ON sm.MOOD_ID = m.MOOD_ID WHERE m.MOOD_ID IS NULL
UNION ALL
SELECT 'Playlists without parent Mood', COUNT(*),
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END
FROM PLAYLISTS p LEFT JOIN MOODS m ON p.MOOD_ID = m.MOOD_ID WHERE m.MOOD_ID IS NULL
UNION ALL
SELECT 'Favorites without parent User', COUNT(*),
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END
FROM FAVORITES f LEFT JOIN USERS u ON f.USER_ID = u.USER_ID WHERE u.USER_ID IS NULL
UNION ALL
SELECT 'Listening History without parent Song', COUNT(*),
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END
FROM LISTENING_HISTORY lh LEFT JOIN SONGS s ON lh.SONG_ID = s.SONG_ID WHERE s.SONG_ID IS NULL;


-- ====================================================================
-- TEST 11: PL/SQL STORED PROCEDURE SMOKE TEST
-- Call RECORD_LISTENING_HISTORY and GET_SONGS_BY_MOOD
-- ====================================================================
PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 11] PL/SQL PROCEDURE SMOKE TEST (RECORD_LISTENING_HISTORY)    ;
PROMPT --------------------------------------------------------------------;

VARIABLE test_hist_id NUMBER;

BEGIN
    RECORD_LISTENING_HISTORY(
        p_user_id          => 2,
        p_song_id          => 8,
        p_mood_id          => 1,
        p_completed        => 'Y',
        p_listened_seconds => 277,
        p_history_id       => :test_hist_id
    );
END;
/

PRINT test_hist_id;

-- Clean up test record from test 11 to keep tests idempotent
DELETE FROM LISTENING_HISTORY WHERE HISTORY_ID = :test_hist_id;
COMMIT;

PROMPT ;
PROMPT --------------------------------------------------------------------;
PROMPT [CHECK 12] PL/SQL PROCEDURE SMOKE TEST (GET_SONGS_BY_MOOD REF CURSOR);
PROMPT --------------------------------------------------------------------;

VARIABLE mood_cursor REFCURSOR;

BEGIN
    GET_SONGS_BY_MOOD('CHILL', :mood_cursor);
END;
/

PRINT mood_cursor;

PROMPT ;
PROMPT ====================================================================;
PROMPT            ALL SWARAM DATABASE SMOKE TESTS COMPLETED                 ;
PROMPT ====================================================================;

SET FEEDBACK ON;
