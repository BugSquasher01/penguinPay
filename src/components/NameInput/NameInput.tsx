import type { NameInputProps } from './types';

// Only allow letters and spaces, no numbers/special characters
const ALLOWED_INPUTS = /[^a-zA-Z ]/g;

const NameInput: React.FC<NameInputProps> = ({ id, label, value, error, disabled, onChange, onBlur }) => (
  <div className="input-field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(ALLOWED_INPUTS, ''))}
      onBlur={onBlur}
      autoComplete="off"
      disabled={disabled}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
    />
    {error && (
      <span id={`${id}-error`} className="field-error" role="alert">
        {error}
      </span>
    )}
  </div>
);

export default NameInput;
