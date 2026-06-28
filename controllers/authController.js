const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = userModel.findByUsername(username);
  if (!user) return res.render('login', { error: 'Usuário não encontrado' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('login', { error: 'Senha inválida' });

  req.session.user = { id: user.id, username: user.username };
  res.redirect('/codes');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
