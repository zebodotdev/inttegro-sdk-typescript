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

export interface BalanceTransaction {
  id?: string;
  payment_id?: string;
  payout_id?: string;
  order_id?: string;
  amount?: MoneyAmount;
  amount_expected?: MoneyAmount;
  amount_available?: MoneyAmount;
  available_at?: string;
  claimed_at?: string;
  paid_at?: string;
  created_at?: string;
  payout_configuration?: PayoutConfiguration | null;
}

export interface LookupBalanceTransactionResponse {
  transaction?: BalanceTransaction;
}

export interface PageBalanceTransactionsResponse {
  page?: {
    number?: number;
    size?: number;
    transactions?: BalanceTransaction[];
  };
}
