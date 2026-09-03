import type { Amount } from './money';

export const PayoutStatuses = {
  Initialized: 'initialized',
  Scheduled: 'scheduled',
  Processing: 'processing',
  Executing: 'executing',
  Succeeded: 'succeeded',
  Invalid: 'invalid',
  Canceled: 'canceled',
} as const;
export type PayoutStatus = (typeof PayoutStatuses)[keyof typeof PayoutStatuses];

export interface PayoutScheduleSpec {
  t_plus?: string;
  label?: string;
  abide?: string;
}

export interface PayoutSchedule {
  id?: string;
  name?: string;
  type?: string;
  interval?: string;
  schedule_on?: string;
  description?: string;
  spec?: PayoutScheduleSpec;
  aging_spec?: PayoutScheduleSpec;
}

export interface PayoutSettings {
  id?: string;
  fx_enabled?: boolean;
  destinations?: Record<string, string>;
  schedule?: PayoutSchedule | null;
}

export interface SetPayoutDestinationsRequest {
  destinations: Record<string, string>;
}

export interface SchedulePayoutRequest {
  destination_id: string;
  execute_after?: string;
  max_amount: number;
  reference: string;
}

export interface LookupPayoutRequest {
  payout_id: string;
}

export interface PagePayoutsRequest {
  page_number?: number;
  page_size?: number;
}

export interface PayoutError {
  type?: string;
  message?: string;
  cause?: string;
  occurred_at?: string;
}

export interface Payout {
  id?: string;
  application_id?: string;
  destination_id?: string;
  amount?: Amount;
  balance_transactions?: string[];
  status?: PayoutStatus;
  initiated_by?: string;
  execute_after?: string;
  scheduled_at?: string;
  scheduled_by?: string;
  canceled_at?: string;
  custom_data?: Record<string, string>;
  error?: PayoutError | null;
  executed_by?: string;
  failed_at?: string | null;
  max_amount?: Amount;
  latest_attempt_id?: string;
  latest_error?: PayoutError;
  reference?: string;
  schedule_id?: string;
  sent_at?: string | null;
  source_id?: string;
  initiated_at?: string;
  executed_at?: string;
  expected_at?: string;
  succeeded_at?: string;
  balance_transaction_ids?: string[];
}

export interface PayoutPage {
  number?: number;
  size?: number;
  payouts?: Payout[];
}

export interface CancelPayoutRequest {
  payout_id: string;
}
