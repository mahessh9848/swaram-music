-- ====================================================================
-- SWARAM DATABASE SCRIPT: 06_seed_moods.sql
-- Purpose: Seeds the 8 standard Swaram mood environments.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram moods (8 moods)...;

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (1, 'SAD', 'Sad', 'A thoughtful soundtrack for quieter moments.', '/assets/backgrounds/sad.png', 'Y', 1);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (2, 'HAPPY', 'Happy', 'Music for brighter moments.', '/assets/backgrounds/happy.png', 'Y', 2);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (3, 'CALM', 'Calm', 'A peaceful soundtrack for a slower pace.', '/assets/backgrounds/calm.jpg', 'Y', 3);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (4, 'ROMANTIC', 'Romantic', 'Music for shared moments.', '/assets/backgrounds/romantic.jpg', 'Y', 4);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (5, 'ENERGETIC', 'Energetic', 'Music to keep the moment moving.', '/assets/backgrounds/energetic.jpg', 'Y', 5);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (6, 'CHILL', 'Chill', 'Easy listening for unhurried moments.', '/assets/backgrounds/chill.jpg', 'Y', 6);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (7, 'LONELY', 'Lonely', 'A quiet soundtrack for solitary moments.', '/assets/backgrounds/lonely.jpg', 'Y', 7);

INSERT INTO MOODS (MOOD_ID, MOOD_CODE, MOOD_NAME, DESCRIPTION, BACKGROUND_PATH, IS_ACTIVE, DISPLAY_ORDER)
VALUES (8, 'ROAD_TRIP', 'Road Trip', 'Music for the journey ahead.', '/assets/backgrounds/roadtrip.jpg', 'Y', 8);

COMMIT;

PROMPT Swaram moods seeded successfully (8 moods).;
SET FEEDBACK ON;
