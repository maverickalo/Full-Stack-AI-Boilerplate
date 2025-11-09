const fs = require('fs').promises;
const path = require('path');
const { query } = require('./db');

// Initialize migrations table
async function initMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// Get executed migrations
async function getExecutedMigrations() {
  const result = await query('SELECT filename FROM migrations ORDER BY id');
  return result.rows.map(row => row.filename);
}

// Run a single migration
async function runMigration(filename, sql) {
  console.log(`Running migration: ${filename}`);
  await query(sql);
  await query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
  console.log(`Migration completed: ${filename}`);
}

// Run all pending migrations
async function migrate() {
  await initMigrations();

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  let migrationFiles = [];

  try {
    migrationFiles = await fs.readdir(migrationsDir);
    migrationFiles = migrationFiles.filter(f => f.endsWith('.sql')).sort();
  } catch (error) {
    console.log('No migrations directory found, skipping migrations');
    return;
  }

  const executedMigrations = await getExecutedMigrations();

  for (const filename of migrationFiles) {
    if (!executedMigrations.includes(filename)) {
      const filepath = path.join(migrationsDir, filename);
      const sql = await fs.readFile(filepath, 'utf8');
      await runMigration(filename, sql);
    }
  }

  console.log('All migrations completed');
}

module.exports = { migrate };