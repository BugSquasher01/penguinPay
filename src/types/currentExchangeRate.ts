import type { CurrencyCode } from './country';

export interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

export interface ExchangeRateState {
  rates: Record<CurrencyCode, number> | null;
  loading: boolean;
  error: string | null;
}