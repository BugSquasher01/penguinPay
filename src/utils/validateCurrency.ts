import type { CurrencyCode } from '../types/country';


// Util function to convert USD to local currency using the exchange rate, and format to 2 decimal places
export function convertUsdToLocal(
  amountUsd: number,
  rate: number
): string {
  return (amountUsd * rate).toFixed(2);
}

// Util to concat the coverted amount with the currency code for display
export function concatReceivedAmount(amount: string, currency: CurrencyCode): string {
  return `${amount} ${currency}`;
}