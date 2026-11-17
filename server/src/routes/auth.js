const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/User');
const RefreshSession = require('../models/RefreshSession');
const PasswordResetChallenge = require('../models/PasswordResetChallenge');
const { authenticate, requireRole } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const ALLOWED_LOGIN_ROLES = ['Customer', 'Admin', 'RiskManager', 'SupportAgent'];
const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many login attempts. Try again in 15 minutes.' });
const registrationLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many registration attempts. Try again later.' });
const refreshLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: 'Too many refresh attempts. Try again later.' });
const recoveryLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many password recovery attempts. Try again later.' });
const otpVerifyLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many OTP attempts. Try again later.' });

function genUID(name, dob) {
  const parts = String(name || 'Customer X').trim().split(/\\s+/);
  const first = (parts[0] || 'X')[0].toUpperCase();
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : 'X').toUpperCase();
  const digits = String(dob || '01012000').replace(/\\D/g, '').padEnd(8, '0').slice(0, 8);
  return 'C' + first + last + digits + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function safeUser(user) {
  return { id: String(user._id), uid: user.uid, name: user.name, email: user.email, role: user.role, dob: user.dob };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function issueAccessToken(user) {
  return jwt.sign(
    { uid: user.uid, email: user.email, role: user.role, tv: user.tokenVersion || 0 },
    process.env.JWT_SECRET,
    { subject: String(user._id), expiresIn: ACCESS_TTL_SECONDS, algorithm: 'HS256' }
  );
}

function cookieOptions(httpOnly) {
  const production = process.env.NODE_ENV === 'production';
  return {
    httpOnly,
    secure: production,
    sameSite: production ? 'none' : 'lax',
    path: '/api/auth'
  };
}

function readCookie(req, name) {
  const raw = String(req.headers.cookie || '');
  const item = raw.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  if (!item) return '';
  try { return decodeURIComponent(item.slice(name.length + 1)); } catch (_) { return ''; }
}

function setRefreshCookies(res, refreshToken, csrfToken) {
  res.cookie('trustshield_refresh', refreshToken, {
    ...cookieOptions(true), maxAge: REFRESH_TTL_MS
  });
  res.cookie('trustshield_csrf', csrfToken, {
    ...cookieOptions(false), maxAge: REFRESH_TTL_MS
  });
}

function clearRefreshCookies(res) {
  res.clearCookie('trustshield_refresh', cookieOptions(true));
  res.clearCookie('trustshield_csrf', cookieOptions(false));
}

async function createRefreshSession(user, req, res, familyId) {
  const refreshToken = crypto.randomBytes(48).toString('base64url');
  const csrfToken = crypto.randomBytes(32).toString('base64url');
  await RefreshSession.create({
    userId: user._id,
    familyId: familyId || crypto.randomUUID(),
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
    ipAddress: String(req.ip || '').slice(0, 64)
  });
  setRefreshCookies(res, refreshToken, csrfToken);
  return csrfToken;
}

function validCsrf(req) {
  const cookie = readCookie(req, 'trustshield_csrf');
  const header = String(req.get('x-csrf-token') || '');
  if (!cookie || !header) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(header);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function revokeFamily(session) {
  await RefreshSession.updateMany(
    { userId: session.userId, familyId: session.familyId, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
  // Revoke all access tokens as well; refresh-token reuse is treated as account-session compromise.
  await User.updateOne({ _id: session.userId }, { $inc: { tokenVersion: 1 } });
}

router.post('/register', registrationLimit, async (req, res) => {
  try {
    const { name, email, password, dob } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 || !normalizedEmail || typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Name, valid email and a password of 12–128 characters are required' });
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(normalizedEmail)) return res.status(400).json({ error: 'A valid email address is required' });
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
    if (!user || !/^\\$2[aby]\\$\\d{2}\\$/.test(String(user.password || '')) || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials. Legacy accounts require the documented password migration first.' });
    }
    const csrfToken = await createRefreshSession(user, req, res);
    const token = issueAccessToken(user);
    return res.json({ msg: 'Login successful', user: safeUser(user), token, expiresIn: ACCESS_TTL_SECONDS, csrfToken });
  } catch (error) {
    if (error && error.message && error.message.includes('JWT_SECRET')) return res.status(503).json({ error: 'Authentication service is not configured' });
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', refreshLimit, async (req, res) => {
  const rawToken = readCookie(req, 'trustshield_refresh');
  if (!rawToken || !validCsrf(req)) return res.status(403).json({ error: 'Refresh session or CSRF validation failed' });
  const tokenHash = hashToken(rawToken);
  try {
    const existing = await RefreshSession.findOne({ tokenHash });
    if (!existing) {
      clearRefreshCookies(res);
      return res.status(401).json({ error: 'Refresh session is invalid or expired' });
    }
    if (existing.revokedAt || existing.replacedByHash) {
      await revokeFamily(existing);
      clearRefreshCookies(res);
      return res.status(401).json({ error: 'Refresh-token reuse detected. All sessions in this token family were revoked.' });
    }
    if (existing.expiresAt <= new Date()) {
      await RefreshSession.updateOne({ _id: existing._id, revokedAt: null }, { $set: { revokedAt: new Date() } });
      clearRefreshCookies(res);
      return res.status(401).json({ error: 'Refresh session expired' });
    }

    const user = await User.findById(existing.userId).select('uid email role tokenVersion name dob');
    if (!user) {
      await RefreshSession.updateOne({ _id: existing._id }, { $set: { revokedAt: new Date() } });
      clearRefreshCookies(res);
      return res.status(401).json({ error: 'Account no longer exists' });
    }

    const nextToken = crypto.randomBytes(48).toString('base64url');
    const nextHash = hashToken(nextToken);
    const nextCsrf = crypto.randomBytes(32).toString('base64url');
    await RefreshSession.create({
      userId: user._id,
      familyId: existing.familyId,
      tokenHash: nextHash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: String(req.get('user-agent') || '').slice(0, 300),
      ipAddress: String(req.ip || '').slice(0, 64)
    });
    const rotated = await RefreshSession.findOneAndUpdate(
      { _id: existing._id, revokedAt: null, replacedByHash: null, expiresAt: { $gt: new Date() } },
      { $set: { replacedByHash: nextHash } },
      { new: true }
    );
    if (!rotated) {
      await RefreshSession.deleteOne({ tokenHash: nextHash });
      const raced = await RefreshSession.findOne({ tokenHash });
      if (raced && raced.replacedByHash) await revokeFamily(raced);
      clearRefreshCookies(res);
      return res.status(401).json({ error: 'Refresh-token rotation conflict; session revoked' });
    }
    setRefreshCookies(res, nextToken, nextCsrf);
    return res.json({ token: issueAccessToken(user), expiresIn: ACCESS_TTL_SECONDS, csrfToken: nextCsrf, user: safeUser(user) });
  } catch (error) {
    clearRefreshCookies(res);
    return res.status(500).json({ error: 'Unable to refresh session' });
  }
});


function hashResetCode(email, code) {
  return crypto.createHmac('sha256', process.env.JWT_SECRET).update(email + ':' + code).digest('hex');
}

function mailTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP email credentials are not configured');
  }
  return require('nodemailer').createTransport({
    host, port, secure: String(process.env.SMTP_SECURE || (port === 465)) === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

router.post('/password/forgot', recoveryLimit, async (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  const generic = { msg: 'If an eligible account exists, password recovery instructions will be sent.' };
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(202).json(generic);
  try {
    const matches = await User.find({ email }).select('_id email').limit(2).lean();
    if (matches.length !== 1) return res.status(202).json(generic);
    const user = matches[0];
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const challenge = await PasswordResetChallenge.create({
      userId: user._id, email, codeHash: hashResetCode(email, code),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });
    try {
      await mailTransport().sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'TrustShield password reset code',
        text: 'Your password reset code is ' + code + '. It expires in 10 minutes. If you did not request this, ignore this email.'
      });
    } catch (mailError) {
      await PasswordResetChallenge.deleteOne({ _id: challenge._id });
      return res.status(202).json(generic);
    }
    return res.status(202).json(generic);
  } catch (error) {
    return res.status(202).json(generic);
  }
});

router.post('/password/reset', otpVerifyLimit, async (req, res) => {
  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  const code = String((req.body && req.body.code) || '');
  const password = req.body && req.body.newPassword;
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || !/^\\d{6}$/.test(code) || typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return res.status(400).json({ error: 'Valid email, six-digit code and a 12–128 character new password are required' });
  }
  try {
    const challenge = await PasswordResetChallenge.findOne({
      email, consumedAt: null, expiresAt: { $gt: new Date() }, attempts: { $lt: 5 }
    }).sort({ createdAt: -1 });
    if (!challenge) return res.status(400).json({ error: 'Invalid or expired recovery code' });
    const submittedHash = hashResetCode(email, code);
    const expected = Buffer.from(challenge.codeHash, 'hex');
    const submitted = Buffer.from(submittedHash, 'hex');
    const matches = expected.length === submitted.length && crypto.timingSafeEqual(expected, submitted);
    if (!matches) {
      await PasswordResetChallenge.updateOne(
        { _id: challenge._id, consumedAt: null, attempts: { $lt: 5 } },
        { $inc: { attempts: 1 } }
      );
      return res.status(400).json({ error: 'Invalid or expired recovery code' });
    }
    const consumed = await PasswordResetChallenge.findOneAndUpdate(
      { _id: challenge._id, consumedAt: null, attempts: { $lt: 5 }, expiresAt: { $gt: new Date() }, codeHash: submittedHash },
      { $set: { consumedAt: new Date() } },
      { new: true }
    );
    if (!consumed) return res.status(400).json({ error: 'Invalid or expired recovery code' });
    const passwordHash = await bcrypt.hash(password, 12);
    const updated = await User.updateOne({ _id: challenge.userId, email }, { $set: { password: passwordHash }, $inc: { tokenVersion: 1 } });
    if (updated.modifiedCount !== 1) return res.status(400).json({ error: 'Unable to reset password for this account' });
    await RefreshSession.updateMany({ userId: challenge.userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
    await PasswordResetChallenge.updateMany({ userId: challenge.userId, consumedAt: null }, { $set: { consumedAt: new Date() } });
    return res.json({ msg: 'Password reset successful. Sign in with your new password.' });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to reset password' });
  }
});

async function revokeUserSessions(userId) {
  await RefreshSession.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
  await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
}

router.post('/logout', authenticate, async (req, res) => {
  try {
    await revokeUserSessions(req.user.id);
    clearRefreshCookies(res);
    return res.json({ msg: 'All sessions revoked. Please sign in again.' });
  } catch (error) { return res.status(500).json({ error: 'Unable to revoke session' }); }
});

router.post('/logout-all', authenticate, async (req, res) => {
  try {
    await revokeUserSessions(req.user.id);
    clearRefreshCookies(res);
    return res.json({ msg: 'All sessions revoked. Please sign in again.' });
  } catch (error) { return res.status(500).json({ error: 'Unable to revoke sessions' }); }
});

router.get('/admin/users', authenticate, requireRole('Admin'), async (req, res) => {
  try { return res.json(await User.find({}).select('uid name email role createdAt').sort({ createdAt: -1 }).limit(100).lean()); }
  catch (error) { return res.status(500).json({ error: 'Unable to load users' }); }
});

module.exports = router;
