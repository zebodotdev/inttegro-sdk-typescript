import type { BalanceTransaction } from './balance-transactions';
import type { Amount } from './money';
import type { PaymentMethod } from './payment-methods';
import type { PaymentAttemptStatus, PaymentConfirmationChannel, PaymentStatus } from './api-enums';

export type { PaymentStatus } from './api-enums';

/** Payout configuration attached to a payment. */
export interface PaymentPayoutConfiguration {
  enable_fx?: boolean;
  destination?: {
    financial_account_id?: string;
  };
}

/** Latest attempt to execute a payment. */
export interface PaymentAttempt {
  payment_method_type?: PaymentMethod['type'];
  payment_method_id?: string;
  reference?: string;
  status?: PaymentAttemptStatus;
  initiated_at?: string;
  succeeded_at?: string;
}

/** A payment collected for an order. */
export interface Payment {
  id?: string;
  status?: PaymentStatus;
  statement_descriptor?: string;
  amount?: Amount;
  payment_method?: PaymentMethod;
  latest_attempt?: PaymentAttempt;
  next_action?: PaymentNextAction | null;
  payout_configuration?: PaymentPayoutConfiguration | null;
  balance_transaction?: BalanceTransaction | null;
  initiated_at?: string;
  executed_at?: string;
  paid_at?: string;
  failed_at?: string;
}

export type PaymentNextActionType =
  | 'confirm_payment'
  | 'execute'
  | 'redirect'
  | 'authorize'
  | 'none';

export interface PaymentNextAction {
  type: PaymentNextActionType;
  confirm_payment?: {
    expires_at: string;
    scheme?: string;
    request?: {
      id: string;
      recipient: string;
      sent_via: PaymentConfirmationChannel;
      token_size: number;
      sender_id: string;
    };
  };
  execute?: Record<string, unknown>;
  redirect?: {
    url: string;
  };
}
