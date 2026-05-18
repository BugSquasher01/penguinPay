import type { TransactionStatus } from '../../types/inputFormFields';

export interface TransactionBannerProps {
  status: TransactionStatus;
  recipientName: string;
}
