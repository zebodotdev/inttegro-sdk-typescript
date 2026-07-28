import { PaymentMethodType, RequestMeta } from './common';

export type MobileMoneyNetwork = 'mtn' | 'vodafone' | 'airteltigo' | 'airtel' | 'telecel' | string;

export interface MobileMoneyDetails {
  account_number: string;
  network: MobileMoneyNetwork;
}

export interface PaymentMethodMobileMoney {
  account_number?: string;
  network?: MobileMoneyNetwork;
}

export interface PaymentMethodBankAccount {
  type?: string;
  ghana_bank_account?: {
    branch?: string;
    name?: string;
    account_number?: string;
    sort_code?: string;
    swift_code?: string;
  } | null;
}

export interface PaymentMethodCard {
  brand?: string;
  expires_on?: string;
  issuer?: {
    email_address?: string;
    name?: string;
    phone_number?: string;
    type?: string;
  };
  owner?: {
    email_address?: string;
    name?: string;
    phone_number?: string;
  };
  type?: string;
}

export interface PaymentMethodVerification {
  completed_at?: string | null;
  initiated_at?: string;
  mechanism?: string;
  request_id?: string;
  type?: string;
}

export interface PaymentMethodData {
  type: 'mobile_money';
  mobile_money: MobileMoneyDetails;
}

export interface PaymentMethodObject {
  id: string;
  customer_id: string;
  type: PaymentMethodType;
  mobile_money?: PaymentMethodMobileMoney | null;
  bank_account?: PaymentMethodBankAccount | null;
  card?: PaymentMethodCard | null;
  verification?: PaymentMethodVerification | null;
  custom_data?: Record<string, string>;
  expires_on?: string | null;
  created_at: string;
  verified: boolean;
  verified_at?: string | null;
}

export interface TokenizePaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  customer_id: string;
  payment_method_data: PaymentMethodData;
  verify_immediately?: boolean;
}

export interface TokenizePaymentMethodResponse {
  payment_method?: PaymentMethodObject;
}

export interface VerifyPaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  payment_method_id: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'failed' | string;

export interface VerifyPaymentMethodResponse {
  verification?: {
    payment_method_id?: string;
    status?: VerificationStatus;
    token_sent_at?: string;
    expires_at?: string;
    delivery?: {
      recipient?: string;
      channel?: 'sms' | 'email' | string;
      sender_id?: string;
    };
  };
}

export interface ConfirmPaymentMethodVerificationRequest {
  payment_method_id: string;
  token: string;
}

export interface ConfirmPaymentMethodVerificationResponse {
  payment_method?: PaymentMethodObject;
}

export interface LookupPaymentMethodRequest {
  payment_method_id: string;
}

export interface LookupPaymentMethodResponse {
  payment_method?: PaymentMethodObject;
}

export interface DeletePaymentMethodRequest {
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  payment_method_id: string;
}

export interface DeletePaymentMethodResponse {
  deleted?: boolean;
  payment_method_id?: string;
}

export interface PaymentMethodTypeSetting {
  type?: PaymentMethodType;
  name?: string;
  description?: string;
  enabled?: boolean;
  confirms_use?: boolean;
}

export interface PaymentMethodSettings {
  mobile_money?: PaymentMethodTypeSetting;
  bank_account?: PaymentMethodTypeSetting;
  card?: PaymentMethodTypeSetting;
  motito?: PaymentMethodTypeSetting;
}

export interface GetPaymentMethodSettingsResponse {
  settings?: PaymentMethodSettings;
}
