const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { authenticate, requireRole } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const ALLOWED_LOGIN_ROLES = ['Customer', 'Admin', 'RiskManager', 'SupportAgent'];
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many login attempts. Try again in 15 minutes.' });
const registrationLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many registration attempts. Try again later.' });

function genUID(name, dob) {
  const parts = String(name || 'Customer X').trim().split(/\s+/);
  const first = (parts[0] || 'X')[0].toUpperCase();
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : 'X').toUpperCase();
  const digits = String(dob || '01012000').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
  return 'C' + first + last + digits + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function safeUser(user) {
  return { id: String(user._id), uid: user.uid, name: user.name, email: user.email, role: user.role, dob: user.dob };
}

function issueToken(user) {
  return jwt.sign(
    { uid: user.uid, email: user.email, role: user.role, tv: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { subject: String(user._id), expiresIn: '1h', algorithm: 'HS256' }
  );
}

router.post('/register', registrationLimit, async (req, res) => {
  try {
    const { name, email, password, dob } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 || !normalizedEmail || typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Name, valid email and a password of 12–128 characters are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ error: 'A valid email address is required' });
    const existing = await User.findOne({ email: normalizedEmail }).select('_id');
    if (existing) return res.status(409).json({ error: 'An account with this email already exists' });
    const user = await User.create({
      uid: genUID(name, dob), name: name.trim(), email: normalizedEmail,
      password: await bcrypt.hash(password, 12), role: 'Customer', tokenVersion: 0, dob
    });
    return res.status(201).json({ msg: 'Registration successful', uid: user.uid, user: safeUser(user) });
  } catch (error) {
    if (error && error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists' });
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', loginLimit, async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    const loginId = String(email || '').trim();
    if (!loginId || typeof password !== 'string' || password.length > 128) return res.status(400).json({ error: 'Email/UID and password are required' });
    if (role && !ALLOWED_LOGIN_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findOne({ $or: [{ email: loginId.toLowerCase() }, { uid: loginId }], ...(role ? { role } : {}) }).select('+password');
    if (!user || !/^\$2[aby]\$\d{2}\$/.test(String(user.password || '')) || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials. Legacy accounts require the documented password migration first.' });
    }
    const token = issueToken(user);
    return res.json({ msg: 'Login successful', user: safeUser(user), token, expiresIn: 3600 });
  } catch (error) {
    if (error && error.message && error.message.includes('JWT_SECRET')) return res.status(503).json({ error: 'Authentication service is not configured' });
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
    return res.json({ msg: 'Session revoked. Please sign in again.' });
  } catch (error) { return res.status(500).json({ error: 'Unable to revoke session' }); }
});

router.post('/logout-all', authenticate, async (req, res) => {
  try {
    await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
    return res.json({ msg: 'All sessions revoked. Please sign in again.' });
  } catch (error) { return res.status(500).json({ error: 'Unable to revoke sessions' }); }
});

router.get('/admin/users', authenticate, requireRole('Admin'), async (req, res) => {
  try { return res.json(await User.find({}).select('-password').limit(100).lean()); }
  catch (error) { return res.status(500).json({ error: 'Unable to load users' }); }
});

module.exports = router;
