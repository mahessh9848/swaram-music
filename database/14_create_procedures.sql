-- ====================================================================
-- SWARAM DATABASE SCRIPT: 14_create_procedures.sql
-- Purpose: Creates core PL/SQL stored procedures and packages for
--          application logic, transaction safety, and backend API integration.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Creating Swaram PL/SQL stored procedures...;

-- ====================================================================
-- 1. PROCEDURE: GET_SONGS_BY_MOOD
-- Returns an active SYS_REFCURSOR with songs mapped to a specified mood code
-- ====================================================================
CREATE OR REPLACE PROCEDURE GET_SONGS_BY_MOOD (
    p_mood_code IN VARCHAR2,
    p_cursor    OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT
            s.SONG_ID,
            s.TITLE,
            NVL(ar.ARTIST_NAME, 'Unknown Artist') AS ARTIST_NAME,
            al.ALBUM_TITLE,
            s.DURATION_SECONDS,
            s.ARTWORK_PATH,
            ss.SOURCE_TYPE,
            ss.SOURCE_REFERENCE,
            sm.RELEVANCE
        FROM SONG_MOODS sm
        JOIN MOODS m 
            ON sm.MOOD_ID = m.MOOD_ID
        JOIN SONGS s 
            ON sm.SONG_ID = s.SONG_ID
        LEFT JOIN ALBUMS al 
            ON s.ALBUM_ID = al.ALBUM_ID
        LEFT JOIN SONG_ARTISTS sa 
            ON s.SONG_ID = sa.SONG_ID AND sa.ARTIST_ROLE = 'PRIMARY'
        LEFT JOIN ARTISTS ar 
            ON sa.ARTIST_ID = ar.ARTIST_ID
        LEFT JOIN SONG_SOURCES ss 
            ON s.SONG_ID = ss.SONG_ID AND ss.IS_PRIMARY = 'Y'
        WHERE UPPER(m.MOOD_CODE) = UPPER(TRIM(p_mood_code))
          AND s.IS_ACTIVE = 'Y'
        ORDER BY sm.RELEVANCE DESC, s.TITLE ASC;
END GET_SONGS_BY_MOOD;
/
SHOW ERRORS PROCEDURE GET_SONGS_BY_MOOD;
PROMPT 1/4 Created procedure: GET_SONGS_BY_MOOD;

-- ====================================================================
-- 2. PROCEDURE: ADD_FAVORITE
-- Adds a song to a user's favorites idempotently
-- ====================================================================
CREATE OR REPLACE PROCEDURE ADD_FAVORITE (
    p_user_id IN NUMBER,
    p_song_id IN NUMBER
) AS
    v_user_count NUMBER;
    v_song_count NUMBER;
BEGIN
    -- Validate User
    SELECT COUNT(*) INTO v_user_count FROM USERS WHERE USER_ID = p_user_id;
    IF v_user_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'User ID ' || p_user_id || ' does not exist.');
    END IF;

    -- Validate Song
    SELECT COUNT(*) INTO v_song_count FROM SONGS WHERE SONG_ID = p_song_id;
    IF v_song_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Song ID ' || p_song_id || ' does not exist.');
    END IF;

    -- Idempotent merge into favorites
    MERGE INTO FAVORITES f
    USING (SELECT p_user_id AS u_id, p_song_id AS s_id FROM DUAL) src
    ON (f.USER_ID = src.u_id AND f.SONG_ID = src.s_id)
    WHEN MATCHED THEN
        UPDATE SET f.ADDED_AT = SYSTIMESTAMP
    WHEN NOT MATCHED THEN
        INSERT (USER_ID, SONG_ID, ADDED_AT)
        VALUES (src.u_id, src.s_id, SYSTIMESTAMP);

    COMMIT;
END ADD_FAVORITE;
/
SHOW ERRORS PROCEDURE ADD_FAVORITE;
PROMPT 2/4 Created procedure: ADD_FAVORITE;

-- ====================================================================
-- 3. PROCEDURE: REMOVE_FAVORITE
-- Removes a song from a user's favorites
-- ====================================================================
CREATE OR REPLACE PROCEDURE REMOVE_FAVORITE (
    p_user_id IN NUMBER,
    p_song_id IN NUMBER
) AS
BEGIN
    DELETE FROM FAVORITES
    WHERE USER_ID = p_user_id
      AND SONG_ID = p_song_id;

    COMMIT;
END REMOVE_FAVORITE;
/
SHOW ERRORS PROCEDURE REMOVE_FAVORITE;
PROMPT 3/4 Created procedure: REMOVE_FAVORITE;

-- ====================================================================
-- 4. PROCEDURE: RECORD_LISTENING_HISTORY
-- Records user playback activity and returns the generated history ID
-- ====================================================================
CREATE OR REPLACE PROCEDURE RECORD_LISTENING_HISTORY (
    p_user_id          IN NUMBER,
    p_song_id          IN NUMBER,
    p_mood_id          IN NUMBER DEFAULT NULL,
    p_completed        IN CHAR DEFAULT 'N',
    p_listened_seconds IN NUMBER DEFAULT 0,
    p_history_id       OUT NUMBER
) AS
    v_song_count NUMBER;
    v_completed  CHAR(1);
    v_seconds    NUMBER;
BEGIN
    -- Validate Song (required)
    SELECT COUNT(*) INTO v_song_count FROM SONGS WHERE SONG_ID = p_song_id;
    IF v_song_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Song ID ' || p_song_id || ' does not exist.');
    END IF;

    -- Sanitize completion flag
    v_completed := NVL(UPPER(p_completed), 'N');
    IF v_completed NOT IN ('Y', 'N') THEN
        v_completed := 'N';
    END IF;

    -- Sanitize duration
    v_seconds := NVL(p_listened_seconds, 0);
    IF v_seconds < 0 THEN
        v_seconds := 0;
    END IF;

    -- Get next sequence value
    SELECT SEQ_LISTENING_HISTORY.NEXTVAL INTO p_history_id FROM DUAL;

    -- Insert listening record
    INSERT INTO LISTENING_HISTORY (
        HISTORY_ID,
        USER_ID,
        SONG_ID,
        MOOD_ID,
        STARTED_AT,
        COMPLETED,
        LISTENED_SECONDS
    ) VALUES (
        p_history_id,
        p_user_id,
        p_song_id,
        p_mood_id,
        SYSTIMESTAMP,
        v_completed,
        v_seconds
    );

    COMMIT;
END RECORD_LISTENING_HISTORY;
/
SHOW ERRORS PROCEDURE RECORD_LISTENING_HISTORY;
PROMPT 4/4 Created procedure: RECORD_LISTENING_HISTORY;

PROMPT Swaram PL/SQL procedures created successfully (4 procedures).;
SET FEEDBACK ON;
