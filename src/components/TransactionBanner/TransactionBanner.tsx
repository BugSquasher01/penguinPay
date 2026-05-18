import type { TransactionBannerProps } from './types';

const TransactionBanner: React.FC<TransactionBannerProps> = ({ status, recipientName }) => {
  if (status === 'idle') return null;

  return (
    <div
      className={`transaction-banner transaction-banner--${status}`}
      role="status"
      aria-live="polite"
    >
      {status === 'sending' && (
        <p>Sending transaction to {recipientName}…</p>
      )}
      {status === 'sent' && (
        <p>Transaction sent successfully to {recipientName}.</p>
      )}
    </div>
  );
};

export default TransactionBanner;
