const db = require('../database/db');

exports.getAll = () => db.prepare('SELECT * FROM settings').all();

exports.update = (key, value) => {
  return db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value);
};
