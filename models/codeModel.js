const db = require('../database/db');

exports.create = ({ code, batch_id = null }) => {
  return db.prepare('INSERT INTO codes (code, batch_id) VALUES (?, ?)').run(code, batch_id || null);
};

exports.getAll = () => db.prepare('SELECT * FROM codes ORDER BY id DESC').all();

exports.getByBatch = (batchId) => db.prepare('SELECT * FROM codes WHERE batch_id = ? ORDER BY id DESC').all(batchId);

exports.findById = (id) => db.prepare('SELECT * FROM codes WHERE id = ?').get(id);

exports.getNextAvailable = () => db.prepare('SELECT * FROM codes WHERE used = 0 ORDER BY id ASC LIMIT 1').get();

exports.getAvailable = (limit = 50) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 500);
  return db.prepare('SELECT * FROM codes WHERE used = 0 ORDER BY id ASC LIMIT ?').all(safeLimit);
};

exports.markUsed = (id) => db.prepare('UPDATE codes SET used = 1, used_at = CURRENT_TIMESTAMP WHERE id = ? AND used = 0').run(id);

exports.delete = (id) => db.prepare('DELETE FROM codes WHERE id = ?').run(id);

exports.countAll = () => db.prepare('SELECT COUNT(*) as count FROM codes').get().count;

exports.countAvailable = () => db.prepare('SELECT COUNT(*) as count FROM codes WHERE used = 0').get().count;

exports.countUsed = () => db.prepare('SELECT COUNT(*) as count FROM codes WHERE used = 1').get().count;

exports.countUsedToday = () => db.prepare("SELECT COUNT(*) as count FROM codes WHERE used = 1 AND DATE(used_at) = DATE('now', 'localtime')").get().count;

exports.exportByType = (type) => {
  let query = 'SELECT code FROM codes';
  if (type === 'available') query += ' WHERE used = 0';
  if (type === 'used') query += ' WHERE used = 1';
  query += ' ORDER BY id ASC';
  return db.prepare(query).all().map(c => c.code);
};

exports.reset = () => db.prepare('DELETE FROM codes').run();
