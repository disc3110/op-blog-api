const prisma = require('../config/prisma');

function canManageComment(user, comment) {
  if (!user || !comment) return false;

  // Admin can do anything
  if (user.role === 'ADMIN') return true;

  // The comment author
  if (comment.authorId === user.id) return true;

  // The post author
  if (comment.post && comment.post.authorId === user.id) return true;

  return false;
}

// GET /api/posts/:postId/comments (public)
async function getCommentsForPost(req, res) {
  try {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, name: true },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    res.json({ comments });
  } catch (err) {
    console.error('getCommentsForPost error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/posts/:postId/comments (auth required)
async function createComment(req, res) {
  try {
    const postId = Number(req.params.postId);
    const userId = req.user.id;
    const { content } = req.body;

    if (Number.isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Check post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: userId,
      },
    });

    res.status(201).json({ comment });
  } catch (err) {
    console.error('createComment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/comments/:id (auth required)
async function updateComment(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user;
    const { content } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const existing = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!canManageComment(user, existing)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: {
        content: content.trim(),
      },
    });

    res.json({ comment: updated });
  } catch (err) {
    console.error('updateComment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/comments/:id (auth required)
async function deleteComment(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    const existing = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!canManageComment(user, existing)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.comment.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    console.error('deleteComment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
};