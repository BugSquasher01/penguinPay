import { COUNTRIES } from '../../types/country';
import type { CountryCode } from '../../types/country';
import type { PhoneInputProps } from './types';

const PhoneNumberInput: React.FC<PhoneInputProps> = ({ value, countryCode, error, disabled, onChange, onBlur }) => {
  const country = countryCode ? COUNTRIES[countryCode as CountryCode] : null;
  // If we have a country, show the expected number of digits in the placeholder, else prompt to select a country first
  const placeholder = country
    ? `${country.amountOfDigitsAfterPrefix} digits`
    : 'Select a country first';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers, remove characters/special characters etc
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits);
  };

  return (
    <div className="field">
      <label htmlFor="phone-number-input">Phone Number</label>
      <div className="phone-number-input-wrapper">
        {country && <span className="phone-prefix">{country.countryCodePrefix}</span>}
        <input
          id="phone-number-input"
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || !countryCode}
          onBlur={onBlur}
          maxLength={country?.amountOfDigitsAfterPrefix}
          aria-describedby={error ? 'phone-error' : undefined}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <span id="phone-error" className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default PhoneNumberInput;
