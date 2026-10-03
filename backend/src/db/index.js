const oracledb = require('oracledb');
const config = require('../config');

let pool = null;

/**
 * Initialize the Oracle connection pool.
 * Call this once at server startup.
 */
async function initialize() {
  if (!config.oracle.user || !config.oracle.connectString) {
    console.warn(
      '[DB] Oracle credentials not configured. Running in fallback mode — API will return seed data from memory.'
    );
    return;
  }

  // Attempt thick mode initialization if clientDir is specified
  if (config.oracle.clientDir) {
    try {
      oracledb.initOracleClient({ libDir: config.oracle.clientDir });
      console.log(`[DB] Oracle client initialized in Thick mode with libDir: ${config.oracle.clientDir}`);
    } catch (err) {
      console.warn(`[DB] Oracle initOracleClient warning: ${err.message}`);
    }
  }

  try {
    pool = await oracledb.createPool({
      user: config.oracle.user,
      password: config.oracle.password,
      connectString: config.oracle.connectString,
      poolMin: 0,
      poolMax: 10,
      poolIncrement: 1,
    });

    // Test the pool with an actual connection to verify server compatibility and credentials
    const connection = await pool.getConnection();
    await connection.close();
    console.log('[DB] Oracle connection pool successfully created and verified.');
  } catch (err) {
    console.warn('[DB] Could not connect to Oracle database:', err.message);
    if (err.message && err.message.includes('NJS-138')) {
      console.warn(
        '[DB] NOTICE: The local Oracle database version (11g) requires node-oracledb Thick mode.\n' +
        '     To enable Thick mode on 64-bit Node, install 64-bit Oracle Instant Client and set ORACLE_CLIENT_DIR in .env.'
      );
    }
    if (pool) {
      try {
        await pool.close(0);
      } catch (_) {}
      pool = null;
    }
    console.warn('[DB] Running in fallback mode — API will serve seed data.');
  }
}

/**
 * Execute a SQL query against the Oracle database.
 * Returns rows as objects (outFormat: OBJECT).
 */
async function execute(sql, binds = [], options = {}) {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options,
    });
    return result;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('[DB] Error closing connection:', err.message);
      }
    }
  }
}

/**
 * Close the connection pool gracefully.
 */
async function close() {
  if (pool) {
    try {
      await pool.close(2);
      console.log('[DB] Oracle pool closed.');
    } catch (err) {
      console.error('[DB] Error closing pool:', err.message);
    }
    pool = null;
  }
}

/**
 * Check if database is connected.
 */
function isConnected() {
  return pool !== null;
}

module.exports = { initialize, execute, close, isConnected };
