import { describe, it, expect } from 'vitest';
import { convertUsdToLocal, concatReceivedAmount } from '../utils/validateCurrency';

describe('convertUsdToLocal util function', () => {
  it('should return the converted amount to 2 decimal places when given an amount in USD and a conversion rate', () => {
    expect(convertUsdToLocal(10, 130.5)).toBe('1305.00');
  });

  it('should return a value to 2 decimal places when given a whole number', () => {
    expect(convertUsdToLocal(1, 3)).toBe('3.00');
  });
});

describe('concatReceivedAmount util function', () => {
  it('should append the given countryCode to the recieved amount when given both an amount and a countryCode', () => {
    expect(concatReceivedAmount('1305.00', 'KES')).toBe('1305.00 KES');
  });
});
