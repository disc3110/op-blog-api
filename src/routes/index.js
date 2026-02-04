const express = require('express');
const healthController = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');

const router = express.Router();

router.get('/health', healthController.getHealth);
router.use('/auth', authRoutes);  
router.use('/posts', postRoutes);


module.exports = router;