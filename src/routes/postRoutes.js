const express = require('express');
const postController = require('../controllers/postController');
const {
  authenticateToken,
  requireRole,
} = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', postController.getPublishedPosts);

router.get(
  '/mine',
  authenticateToken,
  requireRole('AUTHOR', 'ADMIN'),
  postController.getMyPosts
);

router.get('/:id', postController.getPostById);

// Author/admin CRUD
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