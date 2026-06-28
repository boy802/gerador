const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'app.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const shouldLogQueries = process.env.DB_DEBUG === 'true';
const db = new Database(dbPath, shouldLogQueries ? { verbose: console.log } : {});

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

const migrationsPath = path.join(__dirname, 'migrations.sql');
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readFileSync(migrationsPath, 'utf-8');
  db.exec(migrations);
}

module.exports = db;
