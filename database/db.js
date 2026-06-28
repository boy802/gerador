const Database = require('better-sqlite3');
const db = new Database(process.env.DATABASE_PATH, { verbose: console.log });
module.exports = db;
