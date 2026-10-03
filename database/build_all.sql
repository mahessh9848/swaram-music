-- ====================================================================
-- SWARAM DATABASE MASTER BUILD SCRIPT: build_all.sql
-- Purpose: Complete teardown, schema creation, seeding, views, procedures,
--          and smoke testing for the Swaram Oracle Database.
-- Usage in SQL*Plus:
--     sqlplus scott/tiger @database/build_all.sql
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK ON;
SET DEFINE OFF;
SET SERVEROUTPUT ON SIZE 1000000;
WHENEVER SQLERROR CONTINUE;

PROMPT ;
PROMPT ====================================================================;
PROMPT                  SWARAM ORACLE DATABASE BUILD SUITE                  ;
PROMPT ====================================================================;
PROMPT ;

PROMPT [STAGE 1/16] Tearing down existing Swaram schema objects...;
@@00_drop_all.sql;

WHENEVER SQLERROR EXIT SQL.SQLCODE;

PROMPT [STAGE 2/16] Creating core tables...;
@@01_create_tables.sql;

PROMPT [STAGE 3/16] Creating sequences...;
@@02_create_sequences.sql;

PROMPT [STAGE 4/16] Applying constraints (PK, FK, Unique, Check)...;
@@03_create_constraints.sql;

PROMPT [STAGE 5/16] Creating performance indexes...;
@@04_create_indexes.sql;

PROMPT [STAGE 6/16] Creating sequence and update triggers...;
@@05_create_triggers.sql;

PROMPT [STAGE 7/16] Seeding 8 core Swaram moods...;
@@06_seed_moods.sql;

PROMPT [STAGE 8/16] Seeding 16 system playlists (2 per mood)...;
@@07_seed_playlists.sql;

PROMPT [STAGE 9/16] Seeding development users and preferences...;
@@08_seed_users.sql;

PROMPT [STAGE 10/16] Seeding real songs from swaram/songs...;
@@09_seed_songs.sql;

PROMPT [STAGE 11/16] Mapping songs to moods with relevance weights...;
@@10_seed_song_moods.sql;

PROMPT [STAGE 12/16] Curating playlist track listings...;
@@11_seed_playlist_songs.sql;

PROMPT [STAGE 13/16] Seeding test activity data (favorites, history, user playlists)...;
@@12_seed_test_data.sql;

WHENEVER SQLERROR CONTINUE;
PROMPT [STAGE 14/16] Creating application views (requires CREATE VIEW privilege)...;
@@13_create_views.sql;
WHENEVER SQLERROR EXIT SQL.SQLCODE;

PROMPT [STAGE 15/16] Creating stored procedures...;
@@14_create_procedures.sql;

PROMPT [STAGE 16/16] Running verification smoke tests...;
@@99_smoke_tests.sql;

PROMPT ;
PROMPT ====================================================================;
PROMPT        SWARAM ORACLE DATABASE BUILD COMPLETED SUCCESSFULLY           ;
PROMPT ====================================================================;
PROMPT ;

EXIT;
