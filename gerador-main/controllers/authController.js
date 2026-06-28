const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.getHome = (req, res) => {
  res.render('dashboard');
};

exports.getLogin = (req, res) => {
  if (req.session && req.session.user) return res.redirect('/');
  res.render('login', { error: null });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = userModel.findByUsername(username);

    if (!user) return res.status(401).render('login', { error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).render('login', { error: 'Senha inválida' });

    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/');
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
