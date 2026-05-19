import type { SendButtonProps } from './types';

const label: Record<string, string> = {
  idle: 'Send',
  sending: 'Sending…',
  sent: 'Sent',
};

const SendButton: React.FC<SendButtonProps> = ({ status, disabled, onClick }) => (
  <button
    type="button"
    className={`amount-to-send-button amount-to-send-button--${status}`}
    disabled={disabled || status !== 'idle'}
    onClick={onClick}
  >
    {label[status]}
  </button>
);

export default SendButton;
