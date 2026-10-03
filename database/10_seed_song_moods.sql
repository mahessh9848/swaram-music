-- ====================================================================
-- SWARAM DATABASE SCRIPT: 10_seed_song_moods.sql
-- Purpose: Relates real songs to moods with normalized relevance weights (0.00 - 1.00).
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram song-to-mood relevance mappings...;

-- Song 1: Calm (180s) -> CALM (Primary), CHILL (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (1, 3, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (1, 6, 0.75);

-- Song 2: Chill (215s) -> CHILL (Primary), CALM (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (2, 6, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (2, 3, 0.70);

-- Song 3: Energetic (145s) -> ENERGETIC (Primary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (3, 5, 1.00);

-- Song 4: Energetic 2 (297s) -> ENERGETIC (Primary), ROAD_TRIP (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (4, 5, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (4, 8, 0.70);

-- Song 5: Happy (270s) -> HAPPY (Primary), ROAD_TRIP (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (5, 2, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (5, 8, 0.65);

-- Song 6: Lonely (245s) -> LONELY (Primary), SAD (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (6, 7, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (6, 1, 0.85);

-- Song 7: Road Trip (362s) -> ROAD_TRIP (Primary), HAPPY (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (7, 8, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (7, 2, 0.70);

-- Song 8: Sad (277s) -> SAD (Primary), LONELY (Secondary)
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (8, 1, 1.00);
INSERT INTO SONG_MOODS (SONG_ID, MOOD_ID, RELEVANCE) VALUES (8, 7, 0.80);

COMMIT;

PROMPT Swaram song-to-mood mappings seeded successfully.;
SET FEEDBACK ON;
