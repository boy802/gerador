const codeModel = require('../models/codeModel');
const batchModel = require('../models/batchModel');
const historyModel = require('../models/historyModel');
const { generateCode } = require('../utils/codeGenerator');
const fileHandler = require('../utils/fileHandler');

exports.listCodes = (req, res) => {
  const codes = codeModel.getAll();
  res.render('codes', { codes });
};

exports.generateCodes = (req, res) => {
  const { quantity, prefix, suffix, length, alpha, numeric } = req.body;
  const batchId = batchModel.create({ name: `Lote ${Date.now()}` });

  for (let i = 0; i < quantity; i++) {
    let code = generateCode({ prefix, suffix, length, alpha, numeric });
    codeModel.create({ code, batch_id: batchId });
  }

  res.redirect('/batches');
};

exports.importCodes = (req, res) => {
  const { filePath } = req.body;
  const codes = fileHandler.readTxt(filePath);
  let imported = 0, ignored = 0;

  codes.forEach(c => {
    try {
      codeModel.create({ code: c });
      imported++;
    } catch {
      ignored++;
    }
  });

  res.json({ imported, ignored });
};

exports.exportCodes = (req, res) => {
  const { type } = req.query;
  const codes = codeModel.exportByType(type);
  const filePath = fileHandler.writeTxt(codes);
  res.download(filePath);
};

exports.useCode = (req, res) => {
  const code = codeModel.getNextAvailable();
  if (!code) return res.json({ error: 'Nenhum código disponível' });

  codeModel.markUsed(code.id);
  historyModel.create({
    code_id: code.id,
    user_id: req.session.user.id,
    origin: 'manual'
  });

  res.json({ code: code.code });
};

exports.deleteCode = (req, res) => {
  codeModel.delete(req.params.id);
  res.json({ success: true });
};
