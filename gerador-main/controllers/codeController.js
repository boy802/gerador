const codeModel = require('../models/codeModel');
const batchModel = require('../models/batchModel');
const historyModel = require('../models/historyModel');
const { generateCode, toPositiveInteger } = require('../utils/codeGenerator');
const fileHandler = require('../utils/fileHandler');

function generateUniqueCodes({ quantity, prefix, suffix, length, alpha, numeric, batchId }) {
  const generated = [];
  const ignored = [];
  const total = toPositiveInteger(quantity, 1, 1, 50000);

  for (let i = 0; i < total; i++) {
    let created = false;

    for (let attempt = 0; attempt < 10; attempt++) {
      const code = generateCode({ prefix, suffix, length, alpha, numeric });

      try {
        codeModel.create({ code, batch_id: batchId });
        generated.push(code);
        created = true;
        break;
      } catch (error) {
        if (!String(error.message).includes('UNIQUE')) throw error;
      }
    }

    if (!created) ignored.push(i + 1);
  }

  return { generated, ignored };
}

exports.listCodes = (req, res) => {
  const codes = codeModel.getAll();
  res.render('codes', { batch: null, codes, message: req.query.message || null, error: req.query.error || null });
};

exports.generateCodes = (req, res) => {
  const { quantity, prefix, suffix, length, alpha, numeric, batchName } = req.body;
  const batchId = batchModel.create({ name: batchName || `Lote ${new Date().toLocaleString('pt-BR')}` });
  const result = generateUniqueCodes({ quantity, prefix, suffix, length, alpha, numeric, batchId });

  const message = `${result.generated.length} código(s) gerado(s)` + (result.ignored.length ? `, ${result.ignored.length} ignorado(s)` : '');
  res.redirect(`/batches?message=${encodeURIComponent(message)}`);
};

exports.importCodes = (req, res) => {
  const { filePath, codesText, batchName } = req.body;
  const batchId = batchModel.create({ name: batchName || `Importação ${new Date().toLocaleString('pt-BR')}` });
  const codes = codesText ? fileHandler.readLines(codesText) : fileHandler.readTxt(filePath);
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

  const message = `${imported} código(s) importado(s), ${ignored} ignorado(s)`;

  if (req.accepts('html')) {
    return res.redirect(`/codes?message=${encodeURIComponent(message)}`);
  }

  res.json({ imported, ignored });
};

exports.exportCodes = (req, res) => {
  const { type } = req.query;
  const codes = codeModel.exportByType(type);
  const filePath = fileHandler.writeTxt(codes);
  res.download(filePath);
};

exports.useCode = (req, res) => {
  const requestedCode = req.body.id ? codeModel.findById(req.body.id) : null;
  const code = requestedCode && !requestedCode.used ? requestedCode : codeModel.getNextAvailable();

  if (!code) {
    if (req.accepts('html')) return res.redirect('/codes?error=Nenhum código disponível');
    return res.status(404).json({ error: 'Nenhum código disponível' });
  }

  const updated = codeModel.markUsed(code.id);
  if (updated.changes === 0) {
    if (req.accepts('html')) return res.redirect('/codes?error=Código já utilizado');
    return res.status(409).json({ error: 'Código já utilizado' });
  }

  historyModel.create({
    code_id: code.id,
    user_id: req.session.user.id,
    origin: 'manual'
  });

  if (req.accepts('html')) {
    return res.redirect(`/codes?message=${encodeURIComponent(`Código ${code.code} marcado como usado`)}`);
  }

  res.json({ code: code.code });
};

exports.deleteCode = (req, res) => {
  codeModel.delete(req.params.id);

  if (req.accepts('html')) return res.redirect('/codes?message=Código excluído');
  res.json({ success: true });
};

exports._generateUniqueCodes = generateUniqueCodes;
