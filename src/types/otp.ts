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
  serviceName: string;
  requestMeta?: RequestMeta;
  messageTemplate?: string;
  preferredGateway?: 'twilio' | 'vonage' | 'africas-talking' | 'termii' | string;
  purpose?: string;
  tokenAlphabet?: string;
  tokenAlphabetType?: OTPAlphabetType;
  tokenSize?: number;
  validityDurationInMinutes?: number;
}

export interface VerifyOtpRequest {
  transactionId: string;
  recipient: string;
  token: string;
}

export interface LookupOtpRequest {
  transactionId: string;
  debugMode?: 0 | 1;
}

export interface CancelOtpRequest {
  transactionId: string;
  reason: string;
}

export interface OtpTransmission {
  recipient?: string;
  senderId?: string;
  sentVia?: string;
  status?: OTPTransmissionStatus;
  sentAt?: string;
}

export interface OtpTransaction {
  id?: string;
  status?: OTPStatus;
  fullMessage?: string;
  initiatedAt?: string;
  expiresAt?: string;
  canceledAt?: string | null;
  cancelReason?: string | null;
  transmission?: OtpTransmission | null;
  recipient?: string;
  sender?: string;
  mechanism?: string;
  gateway?: string;
  preferredGateway?: string;
  createdAt?: string;
  deliveredAt?: string;
  verifiableUntil?: string;
}

export interface OtpVerificationAttempt {
  id?: string;
  recipient?: string;
  presentedToken?: string;
  attemptedAt?: string;
  result?: {
    detail?: string | null;
    verdict?: string;
  };
}

export interface OtpVerification {
  transaction: OtpTransaction;
  verificationAttempt: OtpVerificationAttempt;
}
