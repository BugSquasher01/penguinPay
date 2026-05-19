import { COUNTRIES } from '../types/country';
import type { CountryCode } from '../types/country';
import type { FormErrors, FormValues } from '../types/inputFormFields';


// Validates the phone number based on the selected country code, ensuring it has the correct number of digits after the country prefix
export function validatePhone(phone: string, countryCode: CountryCode): string | undefined {
  const country = COUNTRIES[countryCode];
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length === 0) return 'Phone number is required.';
  if (digitsOnly.length !== country.amountOfDigitsAfterPrefix) {
    return `Phone number must be exactly ${country.amountOfDigitsAfterPrefix} digits after ${country.countryCodePrefix}.`;
  }
  return undefined;
}

// Validates the form values and returns an object containing any validation errors for each field
export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (/[^a-zA-Z ]/.test(values.firstName)) {
    errors.firstName = 'First name must contain letters only.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (/[^a-zA-Z ]/.test(values.lastName)) {
    errors.lastName = 'Last name must contain letters only.';
  }
  if (!values.countryCode) errors.countryCode = 'Please select a country.';

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (values.countryCode) {
    const phoneError = validatePhone(values.phone, values.countryCode as CountryCode);
    if (phoneError) errors.phone = phoneError;
  }

  const amount = parseInt(values.amountUsd, 10);
  if (!values.amountUsd.trim()) {
    errors.amountUsd = 'Amount is required.';
  } else if (!/^\d+$/.test(values.amountUsd.trim())) {
    errors.amountUsd = 'Amount must be a whole number of dollars (digits only, no decimals).';
  } else if (isNaN(amount) || amount <= 0) {
    errors.amountUsd = 'Amount must be greater than zero.';
  }

  return errors;
}
