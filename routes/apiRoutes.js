const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/stats', isAuthenticated, apiController.getStats);
router.get('/codes', isAuthenticated, apiController.getCodes);
router.post('/generate', isAuthenticated, apiController.generateCodes);
router.post('/import', isAuthenticated, apiController.importCodes);
router.get('/export', isAuthenticated, apiController.exportCodes);
router.get('/next', isAuthenticated, apiController.getNextCode);
router.post('/use', isAuthenticated, apiController.useCode);
router.delete('/code/:id', isAuthenticated, apiController.deleteCode);
router.delete('/batch/:id', isAuthenticated, apiController.deleteBatch);
router.delete('/database', isAuthenticated, apiController.resetDatabase);

module.exports = router;
