const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error('JWT verify error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach payload (id, email, role, etc.) to request
    req.user = userPayload;
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // public request
  }

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (err) {
    // invalid token? treat as anonymous
  }

  return next();
}

// require specific roles 
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth,
};