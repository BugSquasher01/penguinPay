import { useEffect, useState } from 'react';
import type { CurrencyCode } from '../types/country';
import { ExchangeRateState } from '../types/currentExchangeRate';
import { getCurrentExchangeRates } from '../api/getCurrentExchangeRates';

const SUPPORTED_CURRENCIES: CurrencyCode[] = ['KES', 'NGN', 'TZS', 'UGX'];

export function useExchangeRates(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    rates: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getCurrentExchangeRates()
      .then((data) => {
        if (cancelled) return;
        const rates = {} as Record<CurrencyCode, number>;
        for (const currency of SUPPORTED_CURRENCIES) {
          const rate = data.rates[currency];
          if (typeof rate === 'number') {
            rates[currency] = rate;
          }
        }
        setState({ rates, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load exchange rates.';
        setState({ rates: null, loading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
