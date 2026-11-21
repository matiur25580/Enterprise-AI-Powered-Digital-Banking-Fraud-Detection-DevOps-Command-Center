jest.mock('express', () => ({ Router: () => ({ post: jest.fn((path, handler) => { global.transferHandler = handler; }), get: jest.fn() }) }));
jest.mock('axios', () => ({ get: jest.fn().mockRejectedValue(new Error('fraud service unavailable')) }));
jest.mock('../src/models/Transaction', () => ({ create: jest.fn(), findOne: jest.fn(), find: jest.fn() }));

const { createHash } = require('crypto');
const Tx = require('../src/models/Transaction');
const router = require('../src/routes/transactions');

function fingerprint(amount, recipient) {
  return createHash('sha256').update(JSON.stringify({ amount, recipient })).digest('hex');
}
function request(key, amount = 125, to = 'recipient-123') {
  return {
    body: { amount, to },
    user: { id: 'user-1', uid: 'C-1' },
    get: name => name === 'Idempotency-Key' ? key : undefined
  };
}
function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

describe('transfer request idempotency', () => {
  beforeEach(() => {
    Tx.create.mockReset();
    Tx.findOne.mockReset();
    Tx.findOne.mockResolvedValue(null);
    global.transferHandler = undefined;
    jest.isolateModules(() => require('../src/routes/transactions'));
  });

  test('replays the original response for the same key and payload', async () => {
    const existing = { _id: 'tx-1', requestFingerprint: fingerprint(125, 'recipient-123') };
    Tx.findOne.mockResolvedValue(existing);
    const res = response();
    await global.transferHandler(request('transfer-0001'), res);
    expect(res.statusCode).toBe(202);
    expect(res.body.idempotentReplay).toBe(true);
    expect(Tx.create).not.toHaveBeenCalled();
  });

  test('rejects reuse of a key for a different payload', async () => {
    Tx.findOne.mockResolvedValue({ requestFingerprint: fingerprint(200, 'recipient-123') });
    const res = response();
    await global.transferHandler(request('transfer-0001', 125), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.code).toBe('IDEMPOTENCY_KEY_REUSED');
    expect(Tx.create).not.toHaveBeenCalled();
  });

  test('recovers a concurrent unique-index race by returning the stored request', async () => {
    const existing = { _id: 'tx-2', requestFingerprint: fingerprint(125, 'recipient-123') };
    Tx.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(existing);
    Tx.create.mockRejectedValue(Object.assign(new Error('duplicate key'), { code: 11000 }));
    const res = response();
    await global.transferHandler(request('transfer-0001'), res);
    expect(res.statusCode).toBe(202);
    expect(res.body.idempotentReplay).toBe(true);
  });

  test('rejects transfer amounts with more than two decimal places', async () => {
    const res = response();
    await global.transferHandler(request('transfer-0001', 12.345), res);
    expect(res.statusCode).toBe(400);
    expect(Tx.create).not.toHaveBeenCalled();
  });

  test('rejects exponent notation instead of silently interpreting a money amount', async () => {
    const res = response();
    await global.transferHandler(request('transfer-0001', '1e3'), res);
    expect(res.statusCode).toBe(400);
    expect(Tx.create).not.toHaveBeenCalled();
  });

  test('accepts a valid decimal amount and stores its numeric value', async () => {
    Tx.create.mockResolvedValue({ _id: 'tx-valid' });
    const res = response();
    await global.transferHandler(request('transfer-0001', '12.34'), res);
    expect(res.statusCode).toBe(202);
    expect(Tx.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 12.34 }));
  });

  test('rejects malformed idempotency keys', async () => {
    const res = response();
    await global.transferHandler(request('bad key'), res);
    expect(res.statusCode).toBe(400);
  });
});
