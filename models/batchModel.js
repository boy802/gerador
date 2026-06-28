const db = require('../database/db');

exports.create = ({ name }) => {
  const result = db.prepare('INSERT INTO batches (name) VALUES (?)').run(name);
  return result.lastInsertRowid;
};

exports.getAll = () => db.prepare('SELECT * FROM batches').all();

exports.findById = (id) => db.prepare('SELECT * FROM batches WHERE id = ?').get(id);

exports.delete = (id) => db.prepare('DELETE FROM batches WHERE id = ?').run(id);

exports.countAll = () => db.prepare('SELECT COUNT(*) as count FROM batches').get().count;

exports.reset = () => db.prepare('DELETE FROM batches').run();
