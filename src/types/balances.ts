export interface BalanceAmount {
  amount?: number;
}

export interface BalanceBreakdown {
  available?: BalanceAmount;
  pending?: BalanceAmount;
  reserved?: BalanceAmount;
  refund?: BalanceAmount;
  includes_transactions_before?: string;
}

export interface BalancesResponse {
  balances?: Record<string, BalanceBreakdown>;
}
