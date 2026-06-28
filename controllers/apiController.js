const codeModel = require('../models/codeModel');
const batchModel = require('../models/batchModel');
const historyModel = require('../models/historyModel');

exports.getStats = (req, res) => {
  res.json({
    total: codeModel.countAll(),
    available: codeModel.countAvailable(),
    used: codeModel.countUsed(),
    batches: batchModel.countAll(),
    lastUsed: historyModel.getLastUsed()
  });
};

exports.getCodes = (req, res) => {
  res.json(codeModel.getAll());
};

exports.generateCodes = (req, res) => {
  // Reutiliza lógica do codeController
};

exports.importCodes = (req, res) => {
  // Reutiliza lógica do codeController
};

exports.exportCodes = (req, res) => {
  // Reutiliza lógica do codeController
};

exports.getNextCode = (req, res) => {
  const code = codeModel.getNextAvailable();
  if (!code) return res.json({ error: 'Nenhum código disponível' });
  res.json({ code: code.code });
};

exports.useCode = (req, res) => {
  codeModel.markUsed(req.body.id);
  historyModel.create({
    code_id: req.body.id,
    user_id: req.session.user.id,
    origin: 'api'
  });
  res.json({ success: true });
};

exports.deleteCode = (req, res) => {
  codeModel.delete(req.params.id);
  res.json({ success: true });
};

exports.deleteBatch = (req, res) => {
  batchModel.delete(req.params.id);
  res.json({ success: true });
};

exports.resetDatabase = (req, res) => {
  codeModel.reset();
  batchModel.reset();
  historyModel.reset();
  res.json({ success: true });
};
