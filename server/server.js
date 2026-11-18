const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { authenticate, requireRole, getJwtSecret } = require('./src/middleware/auth');
const User = require('./src/models/User');

dotenv.config();
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  next();
});
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map(value => value.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'TrustShield API available' }));
app.use('/api/auth', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api', authenticate);

app.use('/api/bank', require('./src/routes/transactions'));
app.use('/api/audit', requireRole('Admin', 'RiskManager'), require('./src/routes/audit'));
app.use('/api/statements', require('./src/routes/statements'));
app.use('/api/large', require('./src/routes/largeTransfer'));
app.use('/api/alerts', requireRole('Admin'), require('./src/routes/alerts'));
app.use('/api/ai', requireRole('Admin', 'RiskManager'), require('./src/routes/aiMetrics'));
app.use('/api/loans', require('./src/routes/loans'));
app.use('/api/wallet', require('./src/routes/wallet'));
app.use('/api/compliance', requireRole('Admin', 'RiskManager'), require('./src/routes/compliance'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/branches', requireRole('Admin'), require('./src/routes/branches'));
app.use('/api/creditScore', require('./src/routes/creditScore'));
app.use('/api/settlement', requireRole('Admin'), require('./src/routes/settlement'));
app.use('/api/chatbot', require('./src/routes/chatbot'));
app.use('/api/deposits', require('./src/routes/deposits'));
app.use('/api/analytics', requireRole('Admin', 'RiskManager'), require('./src/routes/analytics'));
app.use('/api/kyc', require('./src/routes/kyc'));
app.use('/api/disputes', require('./src/routes/disputes'));
app.use('/api/scheduled', require('./src/routes/scheduled'));
app.use('/api/staff', requireRole('Admin'), require('./src/routes/staff'));
app.use('/api/twofa', require('./src/routes/twofa'));

app.use((req, res) => res.status(404).json({
  error: 'Route not found',
  code: 'NOT_FOUND'
}));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error && error.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ error: 'Origin is not allowed', code: 'CORS_ORIGIN_DENIED' });
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON request body', code: 'INVALID_JSON' });
  }
  if (error && error.status === 413) {
    return res.status(413).json({ error: 'Request body is too large', code: 'PAYLOAD_TOO_LARGE' });
  }
  console.error('Unhandled API error:', error && error.message ? error.message : error);
  return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins, credentials: true } });
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    if (!payload.sub || !payload.role || !Number.isInteger(payload.tv)) return next(new Error('Invalid session'));
    const user = await User.findById(payload.sub).select('uid role tokenVersion');
    if (!user || user.role !== payload.role || user.uid !== payload.uid || (user.tokenVersion || 0) !== payload.tv) {
      return next(new Error('Session revoked or no longer valid'));
    }
    socket.user = { id: String(user._id), uid: user.uid, role: user.role };
    return next();
  } catch (error) {
    return next(new Error('Invalid or expired session'));
  }
});
require('./src/routes/realtime')(io);

const PORT = process.env.PORT || 5000;
async function start() {
  getJwtSecret();
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be configured');
  await mongoose.connect(process.env.MONGO_URI);
  server.listen(PORT, () => console.log('TrustShield API listening on ' + PORT));
}
start().catch(error => {
  console.error('Startup failed:', error.message);
  process.exit(1);
});
