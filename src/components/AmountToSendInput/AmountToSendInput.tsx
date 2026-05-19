import type { AmountToSendInputProps } from './types';

const AmountToSendInput: React.FC<AmountToSendInputProps> = ({ value, error, disabled, onChange, onBlur }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pass the raw input through untouched. Validation (see validateForm)
    // surfaces a visible error for decimals/invalid characters instead of
    // silently rewriting the value — a stripped "10.55" would otherwise
    // become "1055", a 100x larger amount.
    onChange(e.target.value);
  };

  return (
    <div className="input-field">
      <label htmlFor="amount-to-send">Amount to Send (USD)</label>
      <div className="amount-to-send-input-wrapper">
        <span className="currency-symbol">$</span>
        <input
          id="amount-to-send"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="0"
          disabled={disabled}
          aria-describedby={error ? 'amount-to-send-error' : undefined}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <span id="amount-to-send-error" className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default AmountToSendInput;
