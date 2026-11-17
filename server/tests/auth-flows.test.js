const authRouter = require('../src/routes/auth');
const RefreshSession = require('../src/models/RefreshSession');
const PasswordResetChallenge = require('../src/models/PasswordResetChallenge');

describe('authentication security primitives', () => {
  beforeAll(() => { process.env.JWT_SECRET = 'unit-test-only-secret-with-at-least-32-characters'; });
  afterAll(() => { delete process.env.JWT_SECRET; });

  test('refresh tokens are represented by deterministic SHA-256 hashes, not plaintext', () => {
    const token = 'opaque-refresh-token-value';
    const hash = authRouter.security.hashToken(token);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toBe(token);
    expect(authRouter.security.hashToken(token)).toBe(hash);
  });

  test('password reset codes are keyed and bound to the account email', () => {
    const hash = authRouter.security.hashResetCode('user@example.test', '123456');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(authRouter.security.hashResetCode('user@example.test', '123456')).toBe(hash);
    expect(authRouter.security.hashResetCode('other@example.test', '123456')).not.toBe(hash);
    expect(authRouter.security.hashResetCode('user@example.test', '654321')).not.toBe(hash);
  });

  test('refresh requires matching CSRF cookie and request header', () => {
    const req = { headers: { cookie: 'trustshield_csrf=abc123' }, get: name => name.toLowerCase() === 'x-csrf-token' ? 'abc123' : '' };
    expect(authRouter.security.validCsrf(req)).toBe(true);
    req.get = () => 'different';
    expect(authRouter.security.validCsrf(req)).toBe(false);
    req.get = () => '';
    expect(authRouter.security.validCsrf(req)).toBe(false);
  });

  test('refresh session schema enforces unique token hashes and expiry index', () => {
    const indexes = RefreshSession.schema.indexes();
    expect(indexes.some(([keys, options]) => keys.tokenHash === 1 && options.unique === true)).toBe(true);
    expect(indexes.some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0)).toBe(true);
  });

  test('password reset challenge has expiring, bounded-attempt fields', () => {
    expect(PasswordResetChallenge.schema.path('attempts').options.max).toBe(5);
    expect(PasswordResetChallenge.schema.path('codeHash')).toBeDefined();
    expect(PasswordResetChallenge.schema.path('consumedAt')).toBeDefined();
    expect(PasswordResetChallenge.schema.indexes().some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0)).toBe(true);
  });
});
