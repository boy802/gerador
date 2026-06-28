const db = require('../database/db');

const defaultSettings = [
  ['site_name', 'Code Manager SaaS'],
  ['code_prefix', ''],
  ['code_suffix', ''],
  ['code_length', '8']
];

exports.ensureDefaults = () => {
  const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(([key, value]) => stmt.run(key, value));
};

exports.getAll = () => {
  exports.ensureDefaults();
  return db.prepare('SELECT * FROM settings ORDER BY key ASC').all();
};

exports.update = (key, value) => {
  if (!key) return null;
  return db.prepare(`
    INSERT INTO settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value || '');
};
