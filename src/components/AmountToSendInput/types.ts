export interface AmountToSendInputProps {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}
