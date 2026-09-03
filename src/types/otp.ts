import type { RequestMeta } from './requests';

export const OtpAlphabetTypes = {
  Numeric: 'numeric',
  Alpha: 'alpha',
  Alphanumeric: 'alphanumeric',
} as const;
export type OTPAlphabetType = (typeof OtpAlphabetTypes)[keyof typeof OtpAlphabetTypes];

export const OtpStatuses = {
  Canceled: 'canceled',
  Expired: 'expired',
  Pending: 'pending',
  PendingDelivery: 'pending_delivery',
  PendingVerification: 'pending_verification',
  Verified: 'verified',
} as const;
export type OTPStatus = (typeof OtpStatuses)[keyof typeof OtpStatuses];

export const OtpTransmissionStatuses = {
  Delivered: 'delivered',
  Failed: 'failed',
  Submitted: 'submitted',
} as const;
export type OTPTransmissionStatus =
  (typeof OtpTransmissionStatuses)[keyof typeof OtpTransmissionStatuses];

export const OtpVerificationVerdicts = { Fail: 'fail', Pass: 'pass' } as const;
export type OTPVerificationVerdict =
  (typeof OtpVerificationVerdicts)[keyof typeof OtpVerificationVerdicts];

export interface InitiateOtpRequest {
  recipient: string;
  sender: string;
  service_name: string;
  request_meta?: RequestMeta;
  message_template?: string;
  preferred_gateway?: 'twilio' | 'vonage' | 'africas-talking' | 'termii' | string;
  purpose?: string;
  token_alphabet?: string;
  token_alphabet_type?: OTPAlphabetType;
  token_size?: number;
  validity_duration_in_minutes?: number;
}

export interface VerifyOtpRequest {
  transaction_id: string;
  recipient: string;
  token: string;
}

export interface LookupOtpRequest {
  transaction_id: string;
  debug_mode?: 0 | 1;
}

export interface CancelOtpRequest {
  transaction_id: string;
  reason: string;
}

export interface OtpTransmission {
  recipient?: string;
  sender_id?: string;
  sent_via?: string;
  status?: OTPTransmissionStatus;
  sent_at?: string;
}

export interface OtpTransaction {
  id?: string;
  status?: OTPStatus;
  full_message?: string;
  initiated_at?: string;
  expires_at?: string;
  canceled_at?: string | null;
  cancel_reason?: string | null;
  transmission?: OtpTransmission | null;
  recipient?: string;
  sender?: string;
  mechanism?: string;
  gateway?: string;
  preferred_gateway?: string;
  created_at?: string;
  delivered_at?: string;
  verifiable_until?: string;
}

export interface OtpVerificationAttempt {
  id?: string;
  recipient?: string;
  presented_token?: string;
  attempted_at?: string;
  result?: {
    detail?: string | null;
    verdict?: string;
  };
}

export interface OtpVerification {
  transaction: OtpTransaction;
  verification_attempt: OtpVerificationAttempt;
}
