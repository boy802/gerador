const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, codeController.listCodes);
router.post('/generate', isAuthenticated, codeController.generateCodes);
router.post('/import', isAuthenticated, codeController.importCodes);
router.get('/export', isAuthenticated, codeController.exportCodes);
router.post('/use', isAuthenticated, codeController.useCode);
router.delete('/:id', isAuthenticated, codeController.deleteCode);

module.exports = router;
