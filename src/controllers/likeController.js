const prisma = require('../config/prisma');

function parseId(param) {
  const id = Number(param);
  return Number.isNaN(id) ? null : id;
}

// POST /api/posts/:postId/like
async function likePost(req, res) {
  try {
    const userId = req.user.id;
    const postId = parseId(req.params.postId);

    if (!postId) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // user already liked this post?
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      return res.status(200).json({ message: 'Post already liked' });
    }

    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: { increment: 1 },
        },
      }),
    ]);

    return res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    console.error('likePost error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/comments/:id/like
async function likeComment(req, res) {
  try {
    const userId = req.user.id;
    const commentId = parseId(req.params.id);

    if (!commentId) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existing) {
      return res.status(200).json({ message: 'Comment already liked' });
    }

    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          commentId,
        },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: { increment: 1 },
        },
      }),
    ]);

    return res.status(201).json({ message: 'Comment liked' });
  } catch (err) {
    console.error('likeComment error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/posts/:postId/like
async function unlikePost(req, res) {
  try {
    const userId = req.user.id;
    const postId = parseId(req.params.postId);

    if (!postId) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existing) {
      // Idempotent: already unliked
      return res.status(200).json({ message: 'Post already unliked' });
    }

    await prisma.$transaction([
      prisma.like.delete({
        where: { id: existing.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: { decrement: 1 },
        },
      }),
    ]);

    return res.status(200).json({ message: 'Post unliked' });
  } catch (err) {
    console.error('unlikePost error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/comments/:id/like
async function unlikeComment(req, res) {
  try {
    const userId = req.user.id;
    const commentId = parseId(req.params.id);

    if (!commentId) {
      return res.status(400).json({ message: 'Invalid comment id' });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (!existing) {
      return res.status(200).json({ message: 'Comment already unliked' });
    }

    await prisma.$transaction([
      prisma.like.delete({
        where: { id: existing.id },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: { decrement: 1 },
        },
      }),
    ]);

    return res.status(200).json({ message: 'Comment unliked' });
  } catch (err) {
    console.error('unlikeComment error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
};