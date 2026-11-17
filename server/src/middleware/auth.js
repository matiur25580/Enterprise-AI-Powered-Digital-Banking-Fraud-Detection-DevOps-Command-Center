const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || /replace-with|your_strong_secret|change-me/i.test(secret)) {
    throw new Error('JWT_SECRET must be a unique random secret with at least 32 characters');
  }
  return secret;
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(match[1], getJwtSecret(), { algorithms: ['HS256'] });
    if (!payload.sub || !payload.role) return res.status(401).json({ error: 'Invalid session' });
    req.user = { id: payload.sub, uid: payload.uid, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole, getJwtSecret };
