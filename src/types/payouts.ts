import { MoneyAmount } from './common';

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

export interface PayoutSettingsResponse {
  settings?: PayoutSettings;
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
  amount?: MoneyAmount;
  status?: string;
  initiated_by?: string;
  execute_after?: string;
  scheduled_at?: string;
  canceled_at?: string;
  max_amount?: MoneyAmount;
  latest_attempt_id?: string;
  latest_error?: PayoutError;
  initiated_at?: string;
  executed_at?: string;
  expected_at?: string;
  succeeded_at?: string;
  balance_transaction_ids?: string[];
}

export interface PagePayoutsResponse {
  page?: {
    number?: number;
    size?: number;
    payouts?: Payout[];
  };
}

export interface CancelPayoutRequest {
  payout_id: string;
}

export interface CancelPayoutResponse {
  payout?: Payout;
}
