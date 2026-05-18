import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentExchangeRates, ExchangeRateError } from './getCurrentExchangeRates';

const VALID_RESPONSE = {
  rates: { KES: 130, NGN: 1500, TZS: 2500, UGX: 3700 },
  base: 'USD',
  timestamp: 1700000000,
};

function mockFetch(status: number, body: unknown) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchExchangeRates', () => {
  it('returns parsed rates on a 200 response', async () => {
    mockFetch(200, VALID_RESPONSE);
    const result = await getCurrentExchangeRates();
    expect(result.rates).toEqual(VALID_RESPONSE.rates);
  });

  it('throws ExchangeRateError on a 500 response', async () => {
    mockFetch(500, {});
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError with correct status code on 503', async () => {
    mockFetch(503, {});
    const err = await getCurrentExchangeRates().catch((e) => e);
    expect(err).toBeInstanceOf(ExchangeRateError);
    expect(err.statusCode).toBe(503);
  });

  it('throws ExchangeRateError on a 401 response', async () => {
    mockFetch(401, {});
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError on a 403 response', async () => {
    mockFetch(403, {});
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError on a 429 response', async () => {
    mockFetch(429, {});
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError on any other 4xx response', async () => {
    mockFetch(404, {});
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError when fetch itself rejects (network failure)', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });

  it('throws ExchangeRateError when response body is invalid JSON shape', async () => {
    mockFetch(200, { unexpected: true });
    await expect(getCurrentExchangeRates()).rejects.toBeInstanceOf(ExchangeRateError);
  });
});
