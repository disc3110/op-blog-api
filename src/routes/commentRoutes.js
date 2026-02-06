const express = require('express');
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');

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

// Like a comment
router.post(
  '/:id/like',
  authenticateToken,
  likeController.likeComment
);

// Unlike a comment
router.delete(
  '/:id/like',
  authenticateToken,
  likeController.unlikeComment
);

module.exports = router;