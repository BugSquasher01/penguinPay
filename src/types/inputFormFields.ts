import type { CountryCode } from './country';

export interface FormValues {
  firstName: string;
  lastName: string;
  countryCode: CountryCode | '';
  phone: string;
  amountUsd: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  phone?: string;
  amountUsd?: string;
}

export type TransactionStatus = 'idle' | 'sending' | 'sent';
