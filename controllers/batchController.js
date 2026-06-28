const batchModel = require('../models/batchModel');
const codeModel = require('../models/codeModel');

exports.listBatches = (req, res) => {
  const batches = batchModel.getAll();
  res.render('batches', { batches });
};

exports.viewBatch = (req, res) => {
  const batch = batchModel.findById(req.params.id);
  const codes = codeModel.getByBatch(req.params.id);
  res.render('codes', { batch, codes });
};

exports.deleteBatch = (req, res) => {
  batchModel.delete(req.params.id);
  res.json({ success: true });
};
