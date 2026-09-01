import { CustomData, RequestMeta } from './common';

export interface CustomerAddressInput {
  country: string;
  city?: string;
  line1?: string;
  line2?: string;
  name?: string;
  phone_number?: string;
  post_code?: string;
  region?: string;
}

/**
 * Customer data for new customers
 */
export interface CustomerData {
  /** Customer full name */
  name: string;
  /** Customer email address */
  email_address: string;
  /** Customer phone number */
  phone_number: string;
  /** External reference for the customer */
  reference?: string;
  /** Custom data for the customer */
  custom_data?: CustomData;
}

/**
 * Customer creation request for customer endpoints
 */
export interface CreateCustomerRequest {
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  name: string;
  title?: string;
  suffix?: string;
  reference?: string;
  email_address?: string;
  phone_number?: string;
  custom_data?: CustomData;
  billing_address?: CustomerAddressInput;
  shipping_address?: CustomerAddressInput;
}

export interface UpdateCustomerRequest {
  customer_id: string;
  billing_address?: CustomerAddressInput;
  custom_data?: Record<string, unknown>;
  email_address?: string;
  name?: string;
  phone_number?: string;
  reference?: string;
  shipping_address?: CustomerAddressInput;
  suffix?: string;
  title?: string;
}

export interface LookupCustomerRequest {
  customer_id: string;
}

export interface Customer {
  id: string;
  name: string;
  title?: string | null;
  suffix?: string | null;
  reference?: string | null;
  email_address?: string | null;
  phone_number?: string | null;
  custom_data?: CustomData;
  created_at: string;
}

export interface CustomerResponse {
  customer?: Customer;
}

export interface PageCustomersRequest {
  page_number?: number;
  page_size?: number;
}

export interface PageCustomersResponse {
  page?: {
    number?: number;
    size?: number;
    customers?: Customer[];
  };
}

/**
 * Address information
 */
export interface Address {
  /** Recipient name */
  name: string;
  /** Phone number */
  phone_number: string;
  /** Address line 1 */
  line1: string;
  /** Address line 2 (optional) */
  line2?: string;
  /** Town/City */
  town: string;
  /** Region/State */
  region: string;
  /** Country code (e.g., 'GH') */
  country: string;
  /** District (optional) */
  district?: string;
  /** Postal code (optional) */
  post_code?: string;
}
