import type { ReceivedAmountProps } from './types';

const ReceivedAmount: React.FC<ReceivedAmountProps> = ({ formattedAmount, loading, error }) => (
  <div className="received-amount">
    <span className="received-amount__label">Recipient receives:</span>
    {loading && <span className="received-amount__value">Loading rates...</span>}
    {!loading && error && (
      <span className="received-amount__value received-amount__value--error">{error}</span>
    )}
    {!loading && !error && (
      <span className="received-amount__value received-amount__value--result">
        {formattedAmount ?? '—'}
      </span>
    )}
  </div>
);

export default ReceivedAmount;
