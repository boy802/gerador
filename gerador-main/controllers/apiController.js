const codeModel = require('../models/codeModel');
const batchModel = require('../models/batchModel');
const historyModel = require('../models/historyModel');
const fileHandler = require('../utils/fileHandler');
const { _generateUniqueCodes } = require('./codeController');

exports.getStats = (req, res) => {
  res.json({
    total: codeModel.countAll(),
    available: codeModel.countAvailable(),
    used: codeModel.countUsed(),
    usedToday: codeModel.countUsedToday(),
    batches: batchModel.countAll(),
    lastUsed: historyModel.getLastUsed()
  });
};

exports.getCodes = (req, res) => {
  res.json(codeModel.getAll());
};

exports.generateCodes = (req, res) => {
  const batchId = batchModel.create({ name: req.body.batchName || `API ${new Date().toLocaleString('pt-BR')}` });
  const result = _generateUniqueCodes({ ...req.body, batchId });
  res.status(201).json({ success: true, batchId, generated: result.generated.length, ignored: result.ignored.length, codes: result.generated });
};

exports.importCodes = (req, res) => {
  const batchId = batchModel.create({ name: req.body.batchName || `API Importação ${new Date().toLocaleString('pt-BR')}` });
  const codes = req.body.codesText ? fileHandler.readLines(req.body.codesText) : fileHandler.readTxt(req.body.filePath);
  let imported = 0;
  let ignored = 0;

  codes.forEach(code => {
    try {
      codeModel.create({ code, batch_id: batchId });
      imported++;
    } catch {
      ignored++;
    }
  });

  res.status(201).json({ success: true, batchId, imported, ignored });
};

exports.exportCodes = (req, res) => {
  const codes = codeModel.exportByType(req.query.type);
  res.json({ type: req.query.type || 'all', total: codes.length, codes });
};

exports.getNextCode = (req, res) => {
  const code = codeModel.getNextAvailable();
  if (!code) return res.status(404).json({ error: 'Nenhum código disponível' });
  res.json({ id: code.id, code: code.code });
};

exports.useCode = (req, res) => {
  const code = req.body.id ? codeModel.findById(req.body.id) : codeModel.getNextAvailable();

  if (!code || code.used) {
    return res.status(404).json({ error: 'Código indisponível' });
  }

  const updated = codeModel.markUsed(code.id);
  if (updated.changes === 0) return res.status(409).json({ error: 'Código já utilizado' });

  historyModel.create({
    code_id: code.id,
    user_id: req.session.user.id,
    origin: 'api'
  });

  res.json({ success: true, code: code.code });
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
  historyModel.reset();
  codeModel.reset();
  batchModel.reset();
  res.json({ success: true });
};
