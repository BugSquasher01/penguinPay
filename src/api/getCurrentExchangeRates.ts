import type { ExchangeRateResponse } from '../types/currentExchangeRate';

// NOTE: In a production app this key would not be hardcoded. It would be stored
// as a GitHub Actions secret, injected at build time via a VITE_APP_ID environment
// variable, and the fetch would go through a server-side proxy so the key is
// never visible in the compiled JS bundle and thus never exposed to the client
const APP_ID = '263f46df20cd4bdfa403bf4fdcb93309';
const RATES_URL = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;

export class ExchangeRateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExchangeRateError';
  }
}

export async function getCurrentExchangeRates(): Promise<ExchangeRateResponse> {
  let response: Response;

  try {
    response = await fetch(RATES_URL);
  } catch {
    throw new ExchangeRateError(
      'Unable to reach the exchange rate service. Please check your connection.'
    );
  }

  // server-side errors
  if (response.status >= 500) {
    throw new ExchangeRateError(
      'The exchange rate service is temporarily unavailable. Please try again later.');
  }

  // Unauthorized or Forbidden - do not let the user know this is an auth issue, just that the service is unavailable
  // The users card could be blocked due to fraud etc
  if (response.status === 401 || response.status === 403) {
    throw new ExchangeRateError(
      'The exchange rate service is temporarily unavailable. Please try again later.');
  }

  // Too many requests
  if (response.status === 429) {
    throw new ExchangeRateError(
      'Too many requests to the exchange rate service. Please try again shortly.');
  }

  // generic client-side error
  if (response.status >= 400) {
    throw new ExchangeRateError(
      'Failed to retrieve exchange rates. Please try again.');
  }

  // If we got here, we have a 200 response - but the responsebody might still be malformed
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ExchangeRateError('Received an unreadable response from the exchange rate service.');
  }

  // Validate the shape of the response data before returning it
  if (!isValidExchangeRateResponse(data)) {
    throw new ExchangeRateError('Received unexpected data from the exchange rate service.');
  }

  return data;
}

// Type guard to validate the shape of the exchange rate response
function isValidExchangeRateResponse(data: unknown): data is ExchangeRateResponse {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.rates === 'object' &&
    obj.rates !== null &&
    typeof obj.base === 'string' &&
    typeof obj.timestamp === 'number'
  );
}
