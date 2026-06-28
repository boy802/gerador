const db = require('../database/db');

exports.create = ({ code_id, user_id, origin }) => {
  return db.prepare('INSERT INTO history (code_id, user_id, origin) VALUES (?, ?, ?)').run(code_id, user_id || null, origin || 'manual');
};

exports.getAll = () => db.prepare(`
  SELECT h.*, c.code, COALESCE(u.username, 'Usuário removido') as username
  FROM history h
  LEFT JOIN codes c ON h.code_id = c.id
  LEFT JOIN users u ON h.user_id = u.id
  ORDER BY h.created_at DESC
`).all();

exports.getLastUsed = () => db.prepare(`
  SELECT c.code, h.created_at
  FROM history h
  LEFT JOIN codes c ON h.code_id = c.id
  ORDER BY h.created_at DESC
  LIMIT 5
`).all();

exports.reset = () => db.prepare('DELETE FROM history').run();
