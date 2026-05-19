import { describe, it, expect } from 'vitest';
import { validateForm, validatePhone } from './validateFormFields';
import type { FormValues } from '../types/inputFormFields';

const VALID: FormValues = {
  firstName: 'Jane',
  lastName: 'Smith',
  countryCode: 'KE',
  phone: '712345678', // 9 digits for KE
  amountUsd: '100',
};

describe('validateForm — field presence', () => {
  it('returns no errors for a fully valid form', () => {
    expect(validateForm(VALID)).toEqual({});
  });

  it('requires first name', () => {
    expect(validateForm({ ...VALID, firstName: '' }).firstName).toBeDefined();
  });

  it('requires last name', () => {
    expect(validateForm({ ...VALID, lastName: '' }).lastName).toBeDefined();
  });

  it('requires country selection', () => {
    expect(validateForm({ ...VALID, countryCode: '' }).countryCode).toBeDefined();
  });

  it('requires phone number', () => {
    expect(validateForm({ ...VALID, phone: '' }).phone).toBeDefined();
  });

  it('requires amount', () => {
    expect(validateForm({ ...VALID, amountUsd: '' }).amountUsd).toBeDefined();
  });
});

describe('validateForm — name fields only allow letters', () => {
  it('rejects numbers in first name', () => {
    expect(validateForm({ ...VALID, firstName: 'Jane1' }).firstName).toBeDefined();
  });

  it('rejects special characters in first name', () => {
    expect(validateForm({ ...VALID, firstName: 'Jane!' }).firstName).toBeDefined();
  });

  it('allows spaces in first name', () => {
    expect(validateForm({ ...VALID, firstName: 'Mary Jane' }).firstName).toBeUndefined();
  });

  it('rejects numbers in last name', () => {
    expect(validateForm({ ...VALID, lastName: 'Smith2' }).lastName).toBeDefined();
  });

  it('rejects special characters in last name', () => {
    expect(validateForm({ ...VALID, lastName: 'O\'Brien' }).lastName).toBeDefined();
  });
});

describe('validateForm — amount must be a whole number', () => {
  it('rejects a decimal amount', () => {
    expect(validateForm({ ...VALID, amountUsd: '10.5' }).amountUsd).toBeDefined();
  });

  it('rejects zero', () => {
    expect(validateForm({ ...VALID, amountUsd: '0' }).amountUsd).toBeDefined();
  });

  it('rejects negative values', () => {
    expect(validateForm({ ...VALID, amountUsd: '-5' }).amountUsd).toBeDefined();
  });

  it('rejects non-numeric strings', () => {
    expect(validateForm({ ...VALID, amountUsd: 'abc' }).amountUsd).toBeDefined();
  });

  it('accepts a valid whole number', () => {
    expect(validateForm({ ...VALID, amountUsd: '50' }).amountUsd).toBeUndefined();
  });
});

describe('validatePhone — phone number must be only digits of correct length', () => {
  it('rejects a phone number that is too short for KE', () => {
    expect(validatePhone('12345', 'KE')).toBeDefined();
  });

  it('rejects a phone number that is too long for KE', () => {
    expect(validatePhone('1234567890', 'KE')).toBeDefined();
  });

  it('accepts an exactly correct KE number', () => {
    expect(validatePhone('712345678', 'KE')).toBeUndefined();
  });

  it('accepts an exactly correct NG number (7 digits)', () => {
    expect(validatePhone('8012345', 'NG')).toBeUndefined();
  });

  it('rejects an empty phone number', () => {
    expect(validatePhone('', 'KE')).toBeDefined();
  });
});
