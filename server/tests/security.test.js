const jwt = require('jsonwebtoken');
const { authenticate, requireRole, getJwtSecret } = require('../src/middleware/auth');

describe('JWT authentication middleware', () => {
  const secret = 'test-only-secret-that-is-long-enough-for-hmac-sha256';
  let req;
  let res;
  let next;

  beforeEach(() => {
    process.env.JWT_SECRET = secret;
    req = { headers: {}, user: undefined };
    res = {
      statusCode: 200,
      body: undefined,
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; }
    };
    next = jest.fn();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  test('rejects requests without a bearer token', () => {
    authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects invalid tokens', () => {
    req.headers.authorization = 'Bearer not-a-jwt';
    authenticate(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts a valid token and attaches the verified identity', () => {
    const token = jwt.sign({ uid: 'C123', email: 'customer@example.test', role: 'Customer' }, secret, {
      subject: 'user-id-1', expiresIn: '5m', algorithm: 'HS256'
    });
    req.headers.authorization = 'Bearer ' + token;
    authenticate(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({
      id: 'user-id-1', uid: 'C123', email: 'customer@example.test', role: 'Customer'
    });
  });

  test('rejects weak or missing JWT secrets', () => {
    process.env.JWT_SECRET = 'short';
    expect(() => getJwtSecret()).toThrow('JWT_SECRET');
  });

  test('enforces role authorization', () => {
    req.user = { role: 'Customer' };
    const roleNext = jest.fn();
    requireRole('Admin')(req, res, roleNext);
    expect(res.statusCode).toBe(403);
    expect(roleNext).not.toHaveBeenCalled();
  });
});
