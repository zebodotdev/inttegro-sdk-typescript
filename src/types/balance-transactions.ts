import { MoneyAmount } from './common';

export interface PageBalanceTransactionsRequest {
  page_number?: number;
  page_size?: number;
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
  order_id?: string;
  amount_expected?: MoneyAmount;
  amount_available?: MoneyAmount;
  available_at?: string;
  created_at?: string;
  payout_configuration?: PayoutConfiguration | null;
}

export interface PageBalanceTransactionsResponse {
  page?: {
    number?: number;
    size?: number;
    transactions?: BalanceTransaction[];
  };
}
