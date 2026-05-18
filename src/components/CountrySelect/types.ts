import type { CountryCode } from '../../types/country';

export interface CountrySelectProps {
  value: CountryCode | '';
  error?: string;
  disabled?: boolean;
  onChange: (value: CountryCode | '') => void;
  onBlur?: () => void;
}
