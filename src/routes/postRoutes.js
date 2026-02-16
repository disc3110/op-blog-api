const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const {
  authenticateToken,
  requireRole,
  optionalAuth,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', postController.getPublishedPosts);

router.get('/all', authenticateToken, requireRole('ADMIN'), postController.getAllPosts);

// Author's own posts (drafts and published)
router.get(
  '/mine',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.getMyPosts
);

// Comments for a post 
router.get(
  '/:postId/comments',
  optionalAuth,
  commentController.getCommentsForPost
);

// Create comment on a post (any logged-in user)
router.post(
  '/:postId/comments',
  authenticateToken,
  commentController.createComment
);

// Like a post (any logged-in user)
router.post(
  '/:postId/like',
  authenticateToken,
  likeController.likePost
);

// Unlike a post (any logged-in user)
router.delete(
  '/:postId/like',
  authenticateToken,
  likeController.unlikePost
);

// Public single post
router.get(
  '/:id',
  optionalAuth,
  postController.getPostById
);


router.post(
  '/',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.createPost
);

router.put(
  '/:id',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.updatePost
);

router.patch(
  '/:id/publish',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.togglePublish
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.deletePost
);

module.exports = router;