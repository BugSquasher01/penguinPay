import type { TransactionStatus } from '../../types/inputFormFields';

export interface SendButtonProps {
  status: TransactionStatus;
  disabled: boolean;
  onClick: () => void;
}
