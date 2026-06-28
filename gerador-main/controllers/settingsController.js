const settingsModel = require('../models/settingsModel');

exports.getSettings = (req, res) => {
  const settings = settingsModel.getAll();
  res.render('settings', { settings, message: req.query.message || null });
};

exports.updateSettings = (req, res) => {
  const keys = Array.isArray(req.body.key) ? req.body.key : [req.body.key];
  const values = Array.isArray(req.body.value) ? req.body.value : [req.body.value];

  keys.forEach((key, index) => settingsModel.update(key, values[index]));
  res.redirect('/settings?message=Configurações salvas');
};
