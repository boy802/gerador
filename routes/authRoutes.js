const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router;
