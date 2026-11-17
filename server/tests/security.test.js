jest.mock('../src/models/User', () => ({ findById: jest.fn() }));
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const { authenticate, requireRole, getJwtSecret } = require('../src/middleware/auth');

describe('JWT authentication middleware', () => {
  const secret = 'test-only-secret-that-is-long-enough-for-hmac-sha256';
  let req, res, next;
  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    req = { headers: {} };
    res = { statusCode: 200, body: undefined, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
    next = jest.fn();
    User.findById.mockReset();
  });
  afterAll(() => { delete process.env.JWT_SECRET; });
  test('rejects requests without bearer token', async () => {
    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
  test('rejects invalid tokens', async () => {
    req.headers.authorization = 'Bearer invalid';
    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
  test('accepts a valid active session', async () => {
    const token = jwt.sign({ uid: 'C123', email: 'customer@example.test', role: 'Customer', tv: 0 }, secret, { subject: 'user-id-1', expiresIn: '5m', algorithm: 'HS256' });
    req.headers.authorization = 'Bearer ' + token;
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-id-1', uid: 'C123', email: 'customer@example.test', role: 'Customer', tokenVersion: 0 }) });
    await authenticate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 'user-id-1', uid: 'C123', email: 'customer@example.test', role: 'Customer' });
  });
  test('rejects revoked sessions', async () => {
    const token = jwt.sign({ uid: 'C123', role: 'Customer', tv: 0 }, secret, { subject: 'user-id-1', expiresIn: '5m' });
    req.headers.authorization = 'Bearer ' + token;
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-id-1', uid: 'C123', role: 'Customer', tokenVersion: 1 }) });
    await authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
  test('rejects weak JWT secrets', () => { process.env.JWT_SECRET = 'short'; expect(() => getJwtSecret()).toThrow('JWT_SECRET'); });
  test('enforces role authorization', () => {
    req.user = { role: 'Customer' };
    requireRole('Admin')(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});
