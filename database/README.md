# SWARAM — Oracle Database Architecture & Data Layer

> **Tagline:** *Music that flows with your mood.*  
> **Brand:** SWARAM  
> **Target Engine:** Oracle Database 11g Release 2 (11.2.0.1.0) / 12c / 19c / 21c / 23c  
> **Tooling:** SQL*Plus, PL/SQL, node-oracledb  

---

## 1. Overview & Purpose

The **SWARAM Database** is the single source of truth for persistent data in the Swaram mood-based music platform. Built to enterprise Oracle relational standards, this database provides:
- **Normalized relational schema (3NF)** eliminating data redundancy.
- **Physical audio file abstraction:** Audio sources store web-ready relative references (`/audio/<filename>.mp3`), never hardcoded Windows machine paths.
- **Multi-mood weighted mapping:** Flexible `0.00` to `1.00` relevance scoring enabling songs to naturally belong to primary and secondary emotional states.
- **Curated system playlists & custom user playlists:** High-performance track sequencing with strict constraint enforcement.
- **Auditing & Security:** Zero plaintext passwords (all accounts use SHA-256 hashes), automatic timestamp triggers, and comprehensive referential integrity constraints.
- **Node.js/Express API readiness:** Clean views, optimized B-Tree indexes, and PL/SQL procedures using `SYS_REFCURSOR` for direct consumption by `node-oracledb`.

---

## 2. Entity-Relationship (ER) Architecture

```text
       +--------------------+
       |       USERS        |
       +---------+----------+
                 | 1
                 |
     +-----------+-----------+-------------------------+
     | 1                     | 1                       | 1
+----+--------------+  +-----+------+           +------+---------+
| USER_PREFERENCES  |  | FAVORITES  |           | USER_PLAYLISTS |
+-------------------+  +-----+------+           +-------+--------+
                             | M                        | 1
                             |                          | M
                             |                 +--------+------------+
                             |                 | USER_PLAYLIST_SONGS |
                             |                 +--------+------------+
                             |                          | M
                             +------------+             |
                                          |             |
+-------------------+       +-------------+-------------+----+
| LISTENING_HISTORY |       |                 SONGS          |
+---------+---------+       +------+------------+-------+----+
          | M                      | 1          | 1     | M
          |                        |            |       +--------------+
          |                        |            |                      |
          |           +------------+----+  +----+-----------+    +-----+--------+
          |           |   SONG_SOURCES  |  |   SONG_MOODS   |    | SONG_ARTISTS |
          |           +-----------------+  +----+-----------+    +-----+--------+
          |                                     | M                    | M
          |                                     |                      |
          |           +-----------------+       |                      |
          +---------->|      MOODS      |<------+                      |
                      +--------+--------+                              |
                               | 1                                     |
                               |                                       |
                      +--------+--------+                              |
                      |    PLAYLISTS    |                              |
                      +--------+--------+                              |
                               | 1                                     |
                               +--------+                              |
                               | M      |                              |
                      +--------+--------+----+                         |
                      |    PLAYLIST_SONGS    |                         |
                      +----------------------+                         |
                                                                       |
       +-------------------+                     +---------------------+--+
       |      ALBUMS       |                     |        ARTISTS         |
       +---------+---------+                     +------------------------+
                 | M                                           | 1
                 +---------------------------------------------+
```

---

## 3. Physical Database Files & Structure

All scripts are located in `C:\Users\mamid\OneDrive\Desktop\Projects\swaram\database\`:

| Script File | Purpose |
|---|---|
| [`00_drop_all.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/00_drop_all.sql) | Safe teardown of only Swaram objects in reverse dependency order (preserves existing Scott demo tables `EMP`, `DEPT`, etc.). |
| [`01_create_tables.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/01_create_tables.sql) | DDL for all 15 relational tables with precise Oracle column types (`NUMBER`, `VARCHAR2`, `TIMESTAMP`, `CHAR`). |
| [`02_create_sequences.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/02_create_sequences.sql) | 10 Oracle sequences (`SEQ_USERS`, `SEQ_SONGS`, etc.) configured with `START WITH 100` to prevent ID collisions with seeded data. |
| [`03_create_constraints.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/03_create_constraints.sql) | Primary Keys, Foreign Keys (with safe `ON DELETE CASCADE`), Unique Constraints, and Check constraints. |
| [`04_create_indexes.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/04_create_indexes.sql) | 16 B-Tree performance indexes covering search filters, join keys, and foreign keys. |
| [`05_create_triggers.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/05_create_triggers.sql) | `BEFORE INSERT` primary key auto-population triggers and `BEFORE UPDATE` timestamp triggers (`UPDATED_AT = SYSTIMESTAMP`). |
| [`06_seed_moods.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/06_seed_moods.sql) | Seeds the 8 canonical Swaram moods (Sad, Happy, Calm, Romantic, Energetic, Chill, Lonely, Road Trip) with display orders 1–8. |
| [`07_seed_playlists.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/07_seed_playlists.sql) | Seeds 16 curated system playlists (exactly 2 per mood). |
| [`08_seed_users.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/08_seed_users.sql) | Seeds 3 development accounts (`admin`, `demo_user`, `listener_dev`) with SHA-256 hashed credentials and preferences. |
| [`09_seed_songs.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/09_seed_songs.sql) | Seeds the 8 real audio files discovered in `swaram/songs`, primary artist (`Swaram`), album, and relative source paths. |
| [`10_seed_song_moods.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/10_seed_song_moods.sql) | Seeds normalized relevance weights (`0.00` to `1.00`) mapping songs to primary and natural cross-over moods. |
| [`11_seed_playlist_songs.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/11_seed_playlist_songs.sql) | Curates ordered track listings (`TRACK_NUMBER > 0`) for system playlists. |
| [`12_seed_test_data.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/12_seed_test_data.sql) | Seeds realistic test activity: 5 favorites, 6 listening history entries (including anonymous plays), and 2 user playlists. |
| [`13_create_views.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/13_create_views.sql) | Production relational views (`VW_SONG_DETAILS`, `VW_MOOD_SONGS`, `VW_PLAYLIST_SONGS`, `VW_USER_HISTORY`, `VW_USER_FAVORITES`). |
| [`14_create_procedures.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/14_create_procedures.sql) | Production PL/SQL stored procedures (`GET_SONGS_BY_MOOD`, `ADD_FAVORITE`, `REMOVE_FAVORITE`, `RECORD_LISTENING_HISTORY`). |
| [`99_smoke_tests.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/99_smoke_tests.sql) | Automated verification suite validating record counts, foreign key integrity (orphan audit), and procedure execution. |
| [`build_all.sql`](file:///C:/Users/mamid/OneDrive/Desktop/Projects/swaram/database/build_all.sql) | Master SQL*Plus execution script running the full end-to-end teardown, build, seed, and test suite. |

---

## 4. Real Audio Files Audited & Seeded

The database uses **strictly the real audio files** found in `C:\Users\mamid\OneDrive\Desktop\Projects\swaram\songs`. Zero fake songs were created:

| ID | Title | Source File | Measured Duration | Primary Mood | Secondary Mood | Source Reference |
|---|---|---|---|---|---|---|
| 1 | **Calm** | `calm.mp3` | 180s (3:00) | CALM (1.00) | CHILL (0.75) | `/audio/calm.mp3` |
| 2 | **Chill** | `chill.mp3` | 215s (3:35) | CHILL (1.00) | CALM (0.70) | `/audio/chill.mp3` |
| 3 | **Energetic** | `energytic.mp3` | 145s (2:25) | ENERGETIC (1.00) | — | `/audio/energetic.mp3` |
| 4 | **Energetic 2**| `energytic 2.mp3`| 297s (4:57) | ENERGETIC (1.00) | ROAD_TRIP (0.70)| `/audio/energetic2.mp3`|
| 5 | **Happy** | `happy.mp3` | 270s (4:30) | HAPPY (1.00) | ROAD_TRIP (0.65)| `/audio/happy.mp3` |
| 6 | **Lonely** | `lonely.mp3` | 245s (4:05) | LONELY (1.00) | SAD (0.85) | `/audio/lonely.mp3` |
| 7 | **Road Trip** | `roadtrip.mp3` | 362s (6:02) | ROAD_TRIP (1.00) | HAPPY (0.70) | `/audio/roadtrip.mp3` |
| 8 | **Sad** | `sad.mp3` | 277s (4:37) | SAD (1.00) | LONELY (0.80) | `/audio/sad.mp3` |

> *Note on Romantic Mood:* No pre-packaged audio file for `ROMANTIC` exists in the local source directory. In accordance with database integrity rules, no audio was fabricated. Playlists 7 and 8 (`For Two`, `Afterglow`) are reserved for user-imported MP3 library tracks.

---

## 5. Development Test Accounts

Passwords are stored strictly as cryptographic SHA-256 hashes:

| User ID | Username | Email | Role | Cleartext Password (Dev Only) | Status |
|---|---|---|---|---|---|
| 1 | `admin` | `admin@swaram.local` | `ADMIN` | `Admin@Swaram123` | ACTIVE |
| 2 | `demo_user` | `demo@swaram.local` | `USER` | `Swaram@123` | ACTIVE |
| 3 | `listener_dev`| `listener@swaram.local` | `USER` | `Listener@123` | ACTIVE |

---

## 6. Execution Instructions (SQL*Plus)

### Running the Complete Build
Open a command prompt, navigate to the `database` folder, and run:

```cmd
cd C:\Users\mamid\OneDrive\Desktop\Projects\swaram\database
sqlplus scott/tiger @build_all.sql
```

*(Note for PowerShell users: wrap the argument in quotes: `sqlplus scott/tiger '@build_all.sql'` or run via `cmd /c`)*.

### Running Individual Scripts
Scripts can be executed individually in sequence order:
```cmd
sqlplus -s scott/tiger @00_drop_all.sql
sqlplus -s scott/tiger @01_create_tables.sql
sqlplus -s scott/tiger @02_create_sequences.sql
sqlplus -s scott/tiger @03_create_constraints.sql
sqlplus -s scott/tiger @04_create_indexes.sql
sqlplus -s scott/tiger @05_create_triggers.sql
sqlplus -s scott/tiger @06_seed_moods.sql
sqlplus -s scott/tiger @07_seed_playlists.sql
sqlplus -s scott/tiger @08_seed_users.sql
sqlplus -s scott/tiger @09_seed_songs.sql
sqlplus -s scott/tiger @10_seed_song_moods.sql
sqlplus -s scott/tiger @11_seed_playlist_songs.sql
sqlplus -s scott/tiger @12_seed_test_data.sql
sqlplus -s scott/tiger @14_create_procedures.sql
sqlplus -s scott/tiger @99_smoke_tests.sql
```

### Granting `CREATE VIEW` Privilege (Optional for DBA)
In default Oracle instances, the `SCOTT` user requires explicit `CREATE VIEW` privilege from a DBA account to compile views:
```sql
-- Run as SYSDBA or SYSTEM:
GRANT CREATE VIEW TO SCOTT;
```
Once granted, execute:
```cmd
sqlplus scott/tiger @13_create_views.sql
```

---

## 7. Connecting from Node.js / Express (`node-oracledb`)

### Installation
```bash
npm install oracledb dotenv
```

### Example Express Pool Connection (`db.js`)
```javascript
const oracledb = require('oracledb');
require('dotenv').config();

// Enable auto-commit for transactions if desired
oracledb.autoCommit = true;

let pool;

async function initializeDatabase() {
    pool = await oracledb.createPool({
        user: process.env.ORACLE_USER || 'scott',
        password: process.env.ORACLE_PASSWORD || 'tiger',
        connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521/orcl1',
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 2
    });
    console.log('Connected to Oracle Database connection pool.');
}

async function getSongsByMood(moodCode) {
    const connection = await pool.getConnection();
    try {
        const result = await connection.execute(
            `BEGIN GET_SONGS_BY_MOOD(:mood, :cursor); END;`,
            {
                mood: moodCode.toUpperCase(),
                cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            }
        );
        const resultSet = result.outBinds.cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();
        return rows;
    } finally {
        await connection.close();
    }
}

module.exports = { initializeDatabase, getSongsByMood };
```
