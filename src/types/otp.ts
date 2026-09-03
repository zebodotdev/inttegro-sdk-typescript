import type { RequestMeta } from './requests';
import type { OTPAlphabetType, OTPStatus, OTPTransmissionStatus } from './api-enums';

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
