const bcrypt = require('bcrypt');
const db = require('../database/db');

exports.findByUsername = (username) => {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

exports.create = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
};

exports.countAll = () => db.prepare('SELECT COUNT(*) as count FROM users').get().count;

exports.ensureDefaultAdmin = async () => {
  const totalUsers = exports.countAll();
  if (totalUsers > 0) return null;

  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  await exports.create(username, password);

  return { username, password };
};
