-- ====================================================================
-- SWARAM DATABASE SCRIPT: 08_seed_users.sql
-- Purpose: Seeds development and test users and their preferences.
-- Note: Passwords are stored exclusively as SHA-256 cryptographic hashes.
-- Compatible with Oracle Database 11g, 12c, 19c, 21c, 23c and SQL*Plus.
-- ====================================================================

SET ECHO OFF;
SET FEEDBACK OFF;
PROMPT Seeding Swaram development users and preferences...;

-- 1. ADMIN USER: admin@swaram.local (Password: Admin@Swaram123)
-- SHA-256 Hash: dae519bbd9745bbf49aa088c4ad35815eb7cc46325c90de65ad8995a05cca3cb
INSERT INTO USERS (USER_ID, USERNAME, EMAIL, PASSWORD_HASH, ROLE, ACCOUNT_STATUS)
VALUES (
    1,
    'admin',
    'admin@swaram.local',
    'dae519bbd9745bbf49aa088c4ad35815eb7cc46325c90de65ad8995a05cca3cb',
    'ADMIN',
    'ACTIVE'
);

INSERT INTO USER_PREFERENCES (PREFERENCE_ID, USER_ID, THEME, DEFAULT_MOOD_ID)
VALUES (1, 1, 'DARK', 1);

-- 2. DEMO USER: demo@swaram.local (Password: Swaram@123)
-- SHA-256 Hash: eeb399746ec81083553e233b22f882c590c847c6cc6054c8aa40a50fffecd582
INSERT INTO USERS (USER_ID, USERNAME, EMAIL, PASSWORD_HASH, ROLE, ACCOUNT_STATUS)
VALUES (
    2,
    'demo_user',
    'demo@swaram.local',
    'eeb399746ec81083553e233b22f882c590c847c6cc6054c8aa40a50fffecd582',
    'USER',
    'ACTIVE'
);

INSERT INTO USER_PREFERENCES (PREFERENCE_ID, USER_ID, THEME, DEFAULT_MOOD_ID)
VALUES (2, 2, 'DARK', 1);

-- 3. DEV LISTENER: listener@swaram.local (Password: Listener@123)
-- SHA-256 Hash: 76fc4142b2573901e8f5d963df72aaa736dd0ff638b563b8a47caf39baa8677d
INSERT INTO USERS (USER_ID, USERNAME, EMAIL, PASSWORD_HASH, ROLE, ACCOUNT_STATUS)
VALUES (
    3,
    'listener_dev',
    'listener@swaram.local',
    '76fc4142b2573901e8f5d963df72aaa736dd0ff638b563b8a47caf39baa8677d',
    'USER',
    'ACTIVE'
);

INSERT INTO USER_PREFERENCES (PREFERENCE_ID, USER_ID, THEME, DEFAULT_MOOD_ID)
VALUES (3, 3, 'LIGHT', 2);

COMMIT;

PROMPT Swaram development users seeded successfully (3 users).;
SET FEEDBACK ON;
