const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, automationController.getAutomation);
router.post('/run', isAuthenticated, automationController.runAutomation);

module.exports = router;
