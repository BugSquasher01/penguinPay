export type CountryCode = 'KE' | 'NG' | 'TZ' | 'UG';
// KE - Kenya, NG - Nigeria, TZ - Tanzania, UG - Uganda
export type CurrencyCode = 'KES' | 'NGN' | 'TZS' | 'UGX';

export interface Country {
  name: string;
  currency: CurrencyCode;
  countryCodePrefix: string;
  amountOfDigitsAfterPrefix: number;
}

export const COUNTRIES: Record<CountryCode, Country> = {
  KE: { name: 'Kenya', currency: 'KES', countryCodePrefix: '+254', amountOfDigitsAfterPrefix: 9 },
  NG: { name: 'Nigeria', currency: 'NGN', countryCodePrefix: '+234', amountOfDigitsAfterPrefix: 7 },
  TZ: { name: 'Tanzania', currency: 'TZS', countryCodePrefix: '+255', amountOfDigitsAfterPrefix: 9 },
  UG: { name: 'Uganda', currency: 'UGX', countryCodePrefix: '+256', amountOfDigitsAfterPrefix: 7 },
};