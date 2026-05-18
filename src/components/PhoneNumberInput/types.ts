import type { CountryCode } from '../../types/country';

export interface PhoneInputProps {
  value: string;
  countryCode: CountryCode | '';
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}