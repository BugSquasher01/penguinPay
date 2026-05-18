import type { AmountToSendInputProps } from './types';

const AmountToSendInput: React.FC<AmountToSendInputProps> = ({ value, error, disabled, onChange, onBlur }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits to be input so decimal places is impossible
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits);
  };

  return (
    <div className="input-field">
      <label htmlFor="amount-to-send">Amount to Send (USD)</label>
      <div className="amount-to-send-input-wrapper">
        <span className="currency-symbol">$</span>
        <input
          id="amount-to-send"
          type="text"
          inputMode="numeric"
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
