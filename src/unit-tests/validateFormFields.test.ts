import { describe, it, expect } from 'vitest';
import { validateForm, validatePhone } from '../utils/validateFormFields';
import type { FormValues } from '../types/inputFormFields';

const VALID: FormValues = {
  firstName: 'Jane',
  lastName: 'Smith',
  countryCode: 'KE',
  phone: '712345678', // 9 digits for KE
  amountUsd: '100',
};

describe('validateForm: input fields tests', () => {
  it('should return no errors for a valid form submission', () => {
    expect(validateForm(VALID)).toEqual({});
  });

  it('should require first name to be entered', () => {
    expect(validateForm({ ...VALID, firstName: '' }).firstName).toBeDefined();
  });

  it('should require last name to be entered', () => {
    expect(validateForm({ ...VALID, lastName: '' }).lastName).toBeDefined();
  });

  it('should require country selection to be made', () => {
    expect(validateForm({ ...VALID, countryCode: '' }).countryCode).toBeDefined();
  });

  it('should require phone number to be entered', () => {
    expect(validateForm({ ...VALID, phone: '' }).phone).toBeDefined();
  });

  it('should require Amount to Send to be entered', () => {
    expect(validateForm({ ...VALID, amountUsd: '' }).amountUsd).toBeDefined();
  });
});

describe('validateForm: name fields only allow letters', () => {
  it('should reject numbers in first name field', () => {
    expect(validateForm({ ...VALID, firstName: 'Bobby1' }).firstName).toBeDefined();
  });

  it('should reject special characters in first name field', () => {
    expect(validateForm({ ...VALID, firstName: 'Bobby!!' }).firstName).toBeDefined();
  });

  it('should allow spaces in first name field', () => {
    expect(validateForm({ ...VALID, firstName: 'Bobby Smith Junior' }).firstName).toBeUndefined();
  });

  it('should reject numbers in last name', () => {
    expect(validateForm({ ...VALID, lastName: 'Smith2' }).lastName).toBeDefined();
  });

  it('should reject special characters in last name field', () => {
    expect(validateForm({ ...VALID, lastName: 'O\'Bobbers' }).lastName).toBeDefined();
  });
});

describe('validateForm: Amount to Send must be a whole number', () => {
  it('should reject an amount entered as a decimal', () => {
    expect(validateForm({ ...VALID, amountUsd: '10.5' }).amountUsd).toBeDefined();
  });

  it('should reject an amount of zero USD when entered', () => {
    expect(validateForm({ ...VALID, amountUsd: '0' }).amountUsd).toBeDefined();
  });

  it('should reject negative values', () => {
    expect(validateForm({ ...VALID, amountUsd: '-5' }).amountUsd).toBeDefined();
  });

  it('should reject non-numeric strings', () => {
    expect(validateForm({ ...VALID, amountUsd: 'abc' }).amountUsd).toBeDefined();
  });

  it('should accept a valid whole number', () => {
    expect(validateForm({ ...VALID, amountUsd: '50' }).amountUsd).toBeUndefined();
  });
});

describe('validatePhone: phone number must be only digits of correct length for the selected country', () => {
  it('should reject a phone number that is too short for KE', () => {
    expect(validatePhone('12345', 'KE')).toBeDefined();
  });

  it('should reject a phone number that is too long for KE', () => {
    expect(validatePhone('1234567890', 'KE')).toBeDefined();
  });

  it('should accept a phone number of correct length for KE', () => {
    expect(validatePhone('712345678', 'KE')).toBeUndefined();
  });

  it('should accept a correct NG number (7 digits)', () => {
    expect(validatePhone('8012345', 'NG')).toBeUndefined();
  });

  it('should reject an empty phone number', () => {
    expect(validatePhone('', 'KE')).toBeDefined();
  });
});
