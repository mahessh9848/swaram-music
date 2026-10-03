-- ====================================================================
-- SWARAM DATABASE SCRIPT: 02_create_sequences.sql
-- Purpose: Creates Oracle sequences for numeric primary key generation.
--          Sequences start at 100 to allow clean pre-seeded deterministic
--          system and development IDs (1-99) without key collisions.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Creating Swaram sequences (starting at 100 for application inserts)...;

-- 1. Sequence for USERS
CREATE SEQUENCE SEQ_USERS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 2. Sequence for USER_PREFERENCES
CREATE SEQUENCE SEQ_USER_PREFERENCES
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 3. Sequence for MOODS
CREATE SEQUENCE SEQ_MOODS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 4. Sequence for ARTISTS
CREATE SEQUENCE SEQ_ARTISTS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 5. Sequence for ALBUMS
CREATE SEQUENCE SEQ_ALBUMS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 6. Sequence for SONGS
CREATE SEQUENCE SEQ_SONGS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 7. Sequence for SONG_SOURCES
CREATE SEQUENCE SEQ_SONG_SOURCES
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 8. Sequence for PLAYLISTS
CREATE SEQUENCE SEQ_PLAYLISTS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 9. Sequence for USER_PLAYLISTS
CREATE SEQUENCE SEQ_USER_PLAYLISTS
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 10. Sequence for LISTENING_HISTORY
CREATE SEQUENCE SEQ_LISTENING_HISTORY
    START WITH 100
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

PROMPT Swaram sequences created successfully.;
SET FEEDBACK ON;
