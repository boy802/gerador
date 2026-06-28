const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, historyController.listHistory);

module.exports = router;
