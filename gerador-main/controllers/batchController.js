const batchModel = require('../models/batchModel');
const codeModel = require('../models/codeModel');

exports.listBatches = (req, res) => {
  const batches = batchModel.getAll();
  res.render('batches', { batches, message: req.query.message || null });
};

exports.viewBatch = (req, res) => {
  const batch = batchModel.findById(req.params.id);
  if (!batch) return res.status(404).send('Lote não encontrado');

  const codes = codeModel.getByBatch(req.params.id);
  res.render('codes', { batch, codes, message: null, error: null });
};

exports.deleteBatch = (req, res) => {
  batchModel.delete(req.params.id);

  if (req.accepts('html')) return res.redirect('/batches?message=Lote excluído');
  res.json({ success: true });
};
