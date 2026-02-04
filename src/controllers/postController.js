const prisma = require('../config/prisma');

// helper to check if user can modify a post
function canEditPost(user, post) {
  if (!user || !post) return false;
  if (user.role === 'ADMIN') return true;
  return post.authorId === user.id;
}

// GET /api/posts  (public: only published)
async function getPublishedPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    res.json({ posts });
  } catch (err) {
    console.error('getPublishedPosts error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/posts/:id  (public but drafts protected)
async function getPostById(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user || null; // may be undefined

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If not published, only author or admin can see it
    if (!post.published) {
      if (!user || !canEditPost(user, post)) {
        return res.status(404).json({ message: 'Post not found' }); 
      }
    }

    res.json({ post });
  } catch (err) {
    console.error('getPostById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /api/posts/mine  (author/admin only)
async function getMyPosts(req, res) {
  try {
    const userId = req.user.id;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    res.json({ posts });
  } catch (err) {
    console.error('getMyPosts error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/posts  (author/admin only)
async function createPost(req, res) {
  try {
    const userId = req.user.id;
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: Boolean(published) || false,
        authorId: userId,
      },
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error('createPost error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/posts/:id  (author/admin only)
async function updatePost(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user;
    const { title, content, published } = req.body;

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!canEditPost(user, existing)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        content: content ?? existing.content,
        published:
          typeof published === 'boolean' ? published : existing.published,
      },
    });

    res.json({ post: updated });
  } catch (err) {
    console.error('updatePost error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// PATCH /api/posts/:id/publish  (author/admin only)
async function togglePublish(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!canEditPost(user, existing)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        published: !existing.published,
      },
    });

    res.json({ post: updated });
  } catch (err) {
    console.error('togglePublish error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/posts/:id  (author/admin only)
async function deletePost(req, res) {
  try {
    const id = Number(req.params.id);
    const user = req.user;

    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!canEditPost(user, existing)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.post.delete({ where: { id } });

    res.status(204).send(); // no content
  } catch (err) {
    console.error('deletePost error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getPublishedPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  togglePublish,
  deletePost,
};