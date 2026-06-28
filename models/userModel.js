const db = require('../database/db');

exports.findByUsername = (username) => {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

exports.create = (username, password) => {
  return db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
};
