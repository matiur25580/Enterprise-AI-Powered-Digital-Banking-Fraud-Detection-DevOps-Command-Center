const { rateLimit } = require('../src/middleware/rateLimit');

function makeResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

function makeRequest(ip = '203.0.113.10') {
  return { ip, socket: { remoteAddress: ip } };
}

describe('rateLimit middleware', () => {
  test('blocks requests after the configured limit', () => {
    const limiter = rateLimit({ windowMs: 60_000, max: 1, message: 'Slow down' });
    const next = jest.fn();

    const firstResponse = makeResponse();
    limiter(makeRequest(), firstResponse, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(firstResponse.statusCode).toBe(200);
    expect(firstResponse.headers['RateLimit-Remaining']).toBe('0');

    const secondResponse = makeResponse();
    limiter(makeRequest(), secondResponse, next);
    expect(secondResponse.statusCode).toBe(429);
    expect(secondResponse.body).toEqual({ error: 'Slow down' });
    expect(secondResponse.headers['Retry-After']).toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('keeps separate limiter instances independent for the same IP', () => {
    const loginLimiter = rateLimit({ windowMs: 60_000, max: 1 });
    const registrationLimiter = rateLimit({ windowMs: 60_000, max: 1 });
    const next = jest.fn();

    const loginResponse = makeResponse();
    loginLimiter(makeRequest(), loginResponse, next);

    const registrationResponse = makeResponse();
    registrationLimiter(makeRequest(), registrationResponse, next);

    expect(loginResponse.statusCode).toBe(200);
    expect(registrationResponse.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(2);
  });
});
