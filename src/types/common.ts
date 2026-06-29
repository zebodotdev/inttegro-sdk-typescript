/**
 * Common types used across the SDK
 */

/**
 * Supported currency codes (extensible)
 */
export type Currency = 'ghs' | string;

/**
 * Money amount with currency and value in minor units (e.g., pesewas for GHS)
 */
export interface MoneyAmount {
  /** Currency code (ISO 4217 or similar) */
  currency: Currency;
  /** Amount in minor units (e.g., 20000 = GHS 200.00) */
  value: number;
}

/**
 * Product type
 */
export type ProductType = 'physical' | 'digital' | 'service' | 'voucher' | 'custom' | 'cause';

/**
 * Line item type
 */
export type LineItemType = 'product' | 'fee' | 'shipping';

/**
 * Mobile money network (extensible)
 */
export type MobileMoneyIssuer = 'mtn' | 'vodafone' | 'airteltigo' | string;

/**
 * Payment method type (extensible)
 */
export type PaymentMethodType = 'mobile_money' | 'bank_account' | 'card' | 'motito' | string;

/**
 * Custom data object for key-value pairs
 */
export type CustomData = Record<string, string>;

/**
 * Per-request controls that do not change the operation payload.
 */
export interface RequestMeta {
  /** Idempotency key used to safely retry mutation requests. */
  idempotency_key?: string;
}
