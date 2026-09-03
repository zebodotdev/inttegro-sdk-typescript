import { MoneyAmount } from './common';

export interface PageBalanceTransactionsRequest {
  page_number?: number;
  page_size?: number;
}

export interface LookupBalanceTransactionRequest {
  transaction_id: string;
}

export interface PayoutConfiguration {
  enable_fx?: boolean;
  destination?: {
    financial_account_id?: string;
  };
}

export type BalanceTransactionType = 'payment' | 'refund';

interface BalanceTransactionBase {
  id: string;
  type: BalanceTransactionType;
  payout_id?: string;
  order_id: string;
  amount: MoneyAmount;
  created_at: string;
  available_at?: string;
  claimed_at?: string;
  paid_at?: string;

  /** @deprecated Not returned by the reviewed API. Use `amount`. */
  amount_expected?: MoneyAmount;
  /** @deprecated Not returned by the reviewed API. Use `amount`. */
  amount_available?: MoneyAmount;
  /** @deprecated Not returned on balance transactions by the reviewed API. */
  payout_configuration?: PayoutConfiguration | null;
}

export interface PaymentBalanceTransaction extends BalanceTransactionBase {
  type: 'payment';
  payment_id: string;
  refund_id?: never;
}

export interface RefundBalanceTransaction extends BalanceTransactionBase {
  type: 'refund';
  refund_id: string;
  payment_id?: never;
}

export type BalanceTransaction = PaymentBalanceTransaction | RefundBalanceTransaction;

export interface BalanceTransactionPage {
  number: number;
  size: number;
  transactions?: BalanceTransaction[];
}
