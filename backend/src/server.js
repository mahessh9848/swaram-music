const app = require('./app');
const config = require('./config');
const db = require('./db');

async function start() {
  // Attempt Oracle connection (will warn if not configured)
  await db.initialize();

  app.listen(config.port, () => {
    console.log(`[Swaram API] Server running on http://localhost:${config.port}`);
    console.log(`[Swaram API] Database: ${db.isConnected() ? 'Oracle connected' : 'Fallback mode (no Oracle credentials)'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Swaram API] Shutting down...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Swaram API] Shutting down...');
  await db.close();
  process.exit(0);
});

start();
