import { PaymentMethodType, RequestMeta } from './common';

export type MobileMoneyNetwork = 'airtel' | 'mtn' | 'telecel' | 'vodafone';

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

export interface PaymentMethodOwnerAddress {
  city?: string | null;
  country?: string;
  line_1?: string | null;
  line1?: string | null;
  line_2?: string | null;
  line2?: string | null;
  name?: string | null;
  phone_number?: string | null;
  post_code?: string | null;
  region?: string | null;
}

export interface PaymentMethodOwner {
  name?: string;
  address?: PaymentMethodOwnerAddress | null;
}

export interface PaymentMethodObject {
  id: string;
  active?: boolean;
  archived_at?: string | null;
  customer_id: string;
  type: PaymentMethodType;
  mobile_money?: PaymentMethodMobileMoney | null;
  bank_account?: PaymentMethodBankAccount | null;
  card?: PaymentMethodCard | null;
  owner?: PaymentMethodOwner | null;
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

export interface PagePaymentMethodsRequest {
  customer_id?: string;
  page_number?: number;
  page_size?: number;
}

export interface PagePaymentMethodsResponse {
  page?: {
    number?: number;
    size?: number;
    payment_methods?: PaymentMethodObject[];
  };
}

export interface UpdatePaymentMethodRequest {
  payment_method_id: string;
  custom_data?: Record<string, string | null>;
  active?: boolean;
  archived?: boolean;
  owner?: PaymentMethodOwner;
}

export interface PaymentMethodActionRequest {
  payment_method_id: string;
}

export interface PaymentMethodResponse {
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
