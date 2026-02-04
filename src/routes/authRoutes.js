const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Login existing user
router.post('/login', authController.login);

// Get current user info (requires JWT)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;