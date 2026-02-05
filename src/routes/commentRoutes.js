const express = require('express');
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Edit comment
router.put(
  '/:id',
  authenticateToken,
  commentController.updateComment
);

// Delete comment
router.delete(
  '/:id',
  authenticateToken,
  commentController.deleteComment
);

module.exports = router;