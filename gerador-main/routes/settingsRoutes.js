const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, settingsController.getSettings);
router.post('/', isAuthenticated, settingsController.updateSettings);

module.exports = router;
