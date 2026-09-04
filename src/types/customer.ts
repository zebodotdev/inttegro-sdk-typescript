import type { CustomData } from './custom-data';
import type { RequestMeta } from './requests';

export interface CustomerAddressInput {
  country: string;
  city?: string;
  line1?: string;
  line2?: string;
  name?: string;
  phoneNumber?: string;
  postCode?: string;
  region?: string;
}

/**
 * Customer data for new customers
 */
export interface CustomerData {
  /** Customer full name */
  name: string;
  /** Customer email address */
  emailAddress: string;
  /** Customer phone number */
  phoneNumber: string;
  /** External reference for the customer */
  reference?: string;
  /** Custom data for the customer */
  customData?: CustomData;
}

/**
 * Customer creation request for customer endpoints
 */
export interface CreateCustomerRequest {
  /** Request metadata such as idempotency controls */
  requestMeta?: RequestMeta;
  name: string;
  title?: string;
  suffix?: string;
  reference?: string;
  emailAddress?: string;
  phoneNumber?: string;
  customData?: CustomData;
  billingAddress?: CustomerAddressInput;
  shippingAddress?: CustomerAddressInput;
}

export interface UpdateCustomerRequest {
  customerId: string;
  billingAddress?: CustomerAddressInput;
  customData?: Record<string, unknown>;
  emailAddress?: string;
  name?: string;
  phoneNumber?: string;
  reference?: string;
  shippingAddress?: CustomerAddressInput;
  suffix?: string;
  title?: string;
}

export interface LookupCustomerRequest {
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  title?: string | null;
  suffix?: string | null;
  reference?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  customData?: CustomData;
  createdAt: string;
}

export interface PageCustomersRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface CustomerPage {
  number?: number;
  size?: number;
  customers?: Customer[];
}

/**
 * Address information
 */
export interface Address {
  /** Recipient name */
  name: string;
  /** Phone number */
  phoneNumber: string;
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
  postCode?: string;
}
