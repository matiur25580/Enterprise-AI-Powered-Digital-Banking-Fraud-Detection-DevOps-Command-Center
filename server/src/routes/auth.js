const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { authenticate, requireRole, getJwtSecret } = require('../middleware/auth');

const ALLOWED_LOGIN_ROLES = ['Customer', 'Admin', 'RiskManager', 'SupportAgent'];

function genUID(name, dob) {
  const parts = String(name || 'Customer X').trim().split(/\s+/);
  const first = (parts[0] || 'X')[0].toUpperCase();
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : 'X').toUpperCase();
  const digits = String(dob || '01012000').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
  return 'C' + first + last + digits.slice(0, 2) + digits.slice(2, 4) + digits.slice(4, 8) + crypto.randomBytes(3).toString('hex').toUpperCase();
}

function safeUser(user) {
  return { id: String(user._id), uid: user.uid, name: user.name, email: user.email, role: user.role, dob: user.dob };
}

function issueToken(user) {
  return jwt.sign(
    { uid: user.uid, email: user.email, role: user.role },
    getJwtSecret(),
    { subject: String(user._id), expiresIn: '1h', algorithm: 'HS256' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!name || !normalizedEmail || typeof password !== 'string' || password.length < 12) {
      return res.status(400).json({ error: 'Name, valid email and a password of at least 12 characters are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    const existing = await User.findOne({ email: normalizedEmail }).select('_id');
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

    // Public registration can only create a Customer. Privileged roles are provisioned out-of-band.
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      uid: genUID(name, dob),
      name: String(name).trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: 'Customer',
      dob
    });
    return res.status(201).json({ msg: 'Registration successful', uid: user.uid, user: safeUser(user) });
  } catch (error) {
    if (error && error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists' });
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    const loginId = String(email || '').trim();
    if (!loginId || typeof password !== 'string') return res.status(400).json({ error: 'Email/UID and password are required' });
    if (role && !ALLOWED_LOGIN_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const user = await User.findOne({
      $or: [{ email: loginId.toLowerCase() }, { uid: loginId }],
      ...(role ? { role } : {})
    }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const stored = String(user.password || '');
    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(stored);
    let valid = false;
    if (isBcryptHash) {
      valid = await bcrypt.compare(password, stored);
    } else if (stored.length > 0 && stored === password) {
      user.password = await bcrypt.hash(password, 12);
      await user.save();
      valid = true;
    }
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = issueToken(user);
    return res.json({ msg: 'Login successful', user: safeUser(user), token, expiresIn: 3600 });
  } catch (error) {
    if (error && error.message && error.message.includes('JWT_SECRET')) {
      return res.status(503).json({ error: 'Authentication service is not configured' });
    }
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/admin/users', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').limit(100).lean();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load users' });
  }
});

module.exports = router;
