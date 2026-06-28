const historyModel = require('../models/historyModel');

exports.listHistory = (req, res) => {
  const history = historyModel.getAll();
  res.render('history', { history });
};
