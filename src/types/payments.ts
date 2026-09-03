import type { BalanceTransaction } from './balance-transactions';
import type { Amount } from './money';
import type { PaymentMethod } from './payment-methods';

export const PaymentStatuses = {
  Initiated: 'initiated',
  RequiresAction: 'requires_action',
  Overdue: 'overdue',
  Executed: 'executed',
  Paid: 'paid',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export type PaymentStatus = (typeof PaymentStatuses)[keyof typeof PaymentStatuses];

export const PaymentAttemptStatuses = {
  Initiated: 'initiated',
  Executed: 'executed',
  Succeeded: 'succeeded',
  Canceled: 'canceled',
  Expired: 'expired',
  Failed: 'failed',
  Unknown: 'unknown',
} as const;
export type PaymentAttemptStatus =
  (typeof PaymentAttemptStatuses)[keyof typeof PaymentAttemptStatuses];

export const PaymentConfirmationChannels = { Sms: 'sms', Email: 'email', Push: 'push' } as const;
export type PaymentConfirmationChannel =
  (typeof PaymentConfirmationChannels)[keyof typeof PaymentConfirmationChannels];

export const CheckoutPaymentStatuses = {
  RequiresAction: 'requires_action',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;
export type CheckoutPaymentStatus =
  (typeof CheckoutPaymentStatuses)[keyof typeof CheckoutPaymentStatuses];

export const PaymentResultStatuses = {
  Pending: 'pending',
  RequiresConfirmation: 'requires_confirmation',
  Processing: 'processing',
  Succeeded: 'succeeded',
  Failed: 'failed',
} as const;
export type PaymentResultStatus =
  (typeof PaymentResultStatuses)[keyof typeof PaymentResultStatuses];

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

export const PaymentNextActionTypes = {
  ConfirmPayment: 'confirm_payment',
  Execute: 'execute',
  Redirect: 'redirect',
  Authorize: 'authorize',
  None: 'none',
} as const;
export type PaymentNextActionType =
  (typeof PaymentNextActionTypes)[keyof typeof PaymentNextActionTypes];

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
