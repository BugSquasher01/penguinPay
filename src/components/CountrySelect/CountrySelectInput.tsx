import { COUNTRIES } from '../../types/country';
import type { CountryCode } from '../../types/country';
import type { CountrySelectProps } from './types';

const CountrySelect: React.FC<CountrySelectProps> = ({ value, error, disabled, onChange, onBlur }) => (
  <div className="input-field">
    <label htmlFor="country-select">Recipient Country</label>
    <select
      id="country-select"
      value={value}
      onChange={(e) => onChange(e.target.value as CountryCode | '')}
      onBlur={onBlur}
      disabled={disabled}
      aria-describedby={error ? 'country-error' : undefined}
      aria-invalid={!!error}
    >
      <option value="">Select a country</option>
      {(Object.entries(COUNTRIES) as [CountryCode, (typeof COUNTRIES)[CountryCode]][]).map(
        ([code, country]) => (
          <option key={code} value={code}>
            {country.name}
          </option>
        )
      )}
    </select>
    {error && (
      <span id="country-error" className="input-field-error" role="alert">
        {error}
      </span>
    )}
  </div>
);

export default CountrySelect;
