const settingsModel = require('../models/settingsModel');

exports.getSettings = (req, res) => {
  const settings = settingsModel.getAll();
  res.render('settings', { settings });
};

exports.updateSettings = (req, res) => {
  const { key, value } = req.body;
  settingsModel.update(key, value);
  res.redirect('/settings');
};
