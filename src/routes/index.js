const express = require('express');
const healthController = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

const router = express.Router();

router.get('/health', healthController.getHealth);
router.use('/auth', authRoutes);  
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);


module.exports = router;