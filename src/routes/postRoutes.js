const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const {
  authenticateToken,
  requireRole,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', postController.getPublishedPosts);

// Author's own posts (drafts and published)
router.get(
  '/mine',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.getMyPosts
);

// Comments for a post 
router.get('/:postId/comments', commentController.getCommentsForPost);

// Create comment on a post (any logged-in user)
router.post(
  '/:postId/comments',
  authenticateToken,
  commentController.createComment
);

// Public single post
router.get('/:id', postController.getPostById);


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