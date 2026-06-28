const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, batchController.listBatches);
router.get('/:id', isAuthenticated, batchController.viewBatch);
router.delete('/:id', isAuthenticated, batchController.deleteBatch);

module.exports = router;
