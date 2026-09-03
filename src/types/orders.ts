import type { CustomData } from './custom-data';
import type { Amount, Currency } from './money';
import type { Price, PriceParams } from './prices';
import type { ProductType } from './products';
import type { RequestMeta } from './requests';
import {
  PaymentMethodData,
  MobileMoneyNetwork,
} from './payment-methods';
import { Address, CustomerData } from './customer';
import { BankAccountConfig, FinancialAccountType, WalletType } from './financial-accounts';
import type { Payment, PaymentStatus } from './payments';
import type { CreateRefundRequest, Refund } from './refunds';

export type LineItemType = 'product' | 'fee' | 'shipping';

/**
 * Product line item
 */
export interface ProductLineItemParams {
  /** Internal product ID for reconciliation */
  id?: string;
  /** Product type */
  type: ProductType;
  /** Quantity of the product */
  quantity: number;
  /** Description of the product */
  about?: string;
  /** External reference for the product */
  reference?: string;
  /** Product name */
  name: string;
  /** Tax code (optional) */
  tax_code?: string;
  /** Product price */
  price: PriceParams;
  /** Arbitrary custom data */
  custom_data?: CustomData;
}

/**
 * Fee line item
 */
export interface FeeLineItemParams {
  /** Fee identifier */
  id?: string;
  /** Customer-facing label */
  label?: string;
  /** Fee amount */
  amount: import('./money').AmountParams;
  /** Fee description */
  description?: string;
  /** Tax classification code */
  tax_code?: string;
  /** Fee reference */
  reference?: string;
  /** Arbitrary custom data */
  custom_data?: CustomData;
}

/**
 * Line item - can be a product or a fee
 */
export interface ShippingLineItemParams {
  id?: string;
  label?: string;
  fee: import('./money').AmountParams;
  tax_code?: string;
  custom_data?: CustomData;
}

export type LineItemParams =
  | {
      type: 'product';
      product: ProductLineItemParams;
    }
  | {
      type: 'fee';
      fee: FeeLineItemParams;
    }
  | {
      type: 'shipping';
      shipping: ShippingLineItemParams;
    };

export interface ProductLineItem extends Omit<ProductLineItemParams, 'price'> {
  price: Price;
}

export interface FeeLineItem extends Omit<FeeLineItemParams, 'amount'> {
  amount: Amount;
}

export interface ShippingLineItem extends Omit<ShippingLineItemParams, 'fee'> {
  fee: Amount;
}

export type LineItem =
  | { type: 'product'; product: ProductLineItem }
  | { type: 'fee'; fee: FeeLineItem }
  | { type: 'shipping'; shipping: ShippingLineItem };

/**
 * Billing details for an order
 */
export interface BillingDetails {
  /** Billing email address */
  email_address: string;
  /** Billing phone number */
  phone_number: string;
  /** Billing name */
  name: string;
  /** Billing address */
  address: Address;
}

/**
 * Shipping information
 */
export interface Shipping {
  /** Shipping address */
  address: Address;
}

/**
 * Shipping line item details
 */
export interface ShippingDetails {
  /** Shipping ID */
  id?: string;
  /** Shipping label */
  label?: string;
  /** Shipping fee */
  fee: Amount;
  /** Tax code */
  tax_code?: string;
  /** Arbitrary custom data */
  custom_data?: CustomData;
}

/**
 * Order-specific payout destination configuration
 */
export interface OrderPayoutSettings {
  /** Payout destination for this order */
  destination?: {
    /** ID of an existing financial account to receive payout */
    financial_account_id?: string;
    /** Inline financial account details for payout destination */
    financial_account_data?: {
      type: FinancialAccountType;
      wallet?: {
        type: WalletType;
        mobile_money?: {
          account_number: string;
          network: MobileMoneyNetwork;
        };
      } | null;
      bank_account?: BankAccountConfig | null;
      dosh_account?: Record<string, unknown> | null;
    };
  };
  /** Whether to enable foreign exchange conversion for this order's payout */
  enable_fx?: boolean;
}

/**
 * Order-level invoice rendering settings
 */
export interface InvoiceSettings {
  /** Optional invoice number */
  number?: string;
  /** Optional invoice memo */
  memo?: string;
  /** Optional invoice footer */
  footer?: string;
  /** Invoice-specific custom metadata */
  custom_data?: CustomData;
}

/**
 * Base order creation request
 */
interface BaseCreateOrderRequest {
  /** Line items (products or fees) */
  line_items: LineItemParams[];
  /** Billing details */
  billing_details?: BillingDetails;
  /** Shipping information (required for physical products) */
  shipping?: Shipping;
  /** Custom order number */
  number?: string;
  /** Optional receipt number for downstream reconciliation */
  receipt_number?: string;
  /** Statement descriptor for payment */
  statement_descriptor?: string;
  /** Static prefix, 2-10 characters, used to build statement descriptor as prefix*order_id. Mutually exclusive with statement_descriptor. */
  statement_descriptor_prefix?: string;
  /** Whether to immediately execute payment */
  execute_payment?: boolean;
  /** Whether to explicitly finalize the order regardless of payment execution */
  finalize?: boolean;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  /** Checkout redirect/cancel URLs */
  checkout_settings?: {
    redirect_url?: string;
    cancel_url?: string;
  };
  /** Invoice rendering metadata */
  invoice_settings?: InvoiceSettings;
  /** Order-level custom metadata */
  custom_data?: CustomData;
  /** Order-specific payout settings */
  payout_settings?: OrderPayoutSettings;
}

/**
 * Create order request with new customer data
 */
export interface CreateOrderWithCustomerRequest extends BaseCreateOrderRequest {
  /** Customer data for new customer */
  customer_data: CustomerData;
  /** Customer ID should not be present when creating with customer data */
  customer_id?: never;
  /** Payment method ID should not be present when creating with customer data */
  payment_method_id?: never;
  /** Optional inline payment method details to tokenize and attach */
  payment_method_data?: PaymentMethodData;
}

/**
 * Create order request with existing customer ID
 */
export interface CreateOrderWithCustomerIdRequest extends BaseCreateOrderRequest {
  /** Existing customer ID */
  customer_id: string;
  /** Optional pre-saved payment method ID */
  payment_method_id?: string;
  /** Optional inline payment method details to tokenize and attach */
  payment_method_data?: PaymentMethodData;
  /** Customer data should not be present when using existing customer */
  customer_data?: never;
}

/**
 * Create order request - union of both variants
 */
export type CreateOrderRequest = CreateOrderWithCustomerRequest | CreateOrderWithCustomerIdRequest;

/**
 * Lookup order request
 */
export interface LookupOrderRequest {
  /** Order ID to lookup */
  order_id: string;
}

/**
 * Update order request
 */
export interface UpdateOrderRequest {
  /** Order ID to update */
  order_id: string;
  /** Clear the currently attached payment method */
  clear_payment_method?: boolean;
  /** Replacement order-level custom metadata */
  custom_data?: CustomData;
  /** Invoice rendering metadata */
  invoice_settings?: InvoiceSettings;
  /** Explicit seal decision */
  finalize?: boolean;
  /** Full replacement for the order's line items */
  line_items?: LineItemParams[];
  /** Replacement order number */
  number?: string;
  /** Replacement receipt number */
  receipt_number?: string;
  /** Inline payment method details to tokenize and attach */
  payment_method_data?: PaymentMethodData;
  /** Saved payment method ID to attach */
  payment_method_id?: string;
  /** Replacement payment statement descriptor */
  statement_descriptor?: string;
  /** Replacement payment statement descriptor prefix */
  statement_descriptor_prefix?: string;
}

/**
 * Pay for order with saved payment method
 */
export interface PayOrderRequest {
  /** Order ID to pay for */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  /** Optional saved payment method to use */
  payment_method_id?: string;
  /** Whether payment was already collected offline */
  paid_out_of_band?: boolean;
  /** Payment method data should not be present when using saved method */
  payment_method_data?: never;
}

/**
 * Pay for order with inline payment method data
 */
export interface PayOrderWithMethodRequest {
  /** Order ID to pay for */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  /** Payment method data */
  payment_method_data: PaymentMethodData;
}

/**
 * Pay order request - union of both variants
 */
export type PayOrder = PayOrderRequest | PayOrderWithMethodRequest;

/**
 * Confirm payment request
 */
export interface ConfirmPaymentRequest {
  /** Order ID */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  /** Payment being confirmed */
  payment_id: string;
  /** Confirmation challenge being answered */
  confirmation_id: string;
  /** Confirmation token (e.g., OTP) */
  token: string;
}

/**
 * Request confirmation request
 */
export interface RequestConfirmationRequest {
  /** Order ID */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
}

/**
 * Finalize order request
 */
export interface FinalizeOrderRequest {
  /** Order ID to finalize */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
}

/**
 * Complete order request
 */
export interface CompleteOrderRequest {
  /** Order ID to complete */
  order_id: string;
  /** Whether payment was collected out of band */
  paid_out_of_band?: boolean;
}

/**
 * Cancel order request
 */
export interface CancelOrderRequest {
  /** Order ID to cancel */
  order_id: string;
  /** Request metadata such as idempotency controls */
  request_meta?: RequestMeta;
  /** Optional cancellation reason */
  reason?: string;
  /** Record whether a refund was requested as part of the cancellation */
  execute_refund?: boolean;
}

/** @deprecated Prefer `CreateRefundRequest` through `client.refunds.create`. */
export type RefundOrderRequest = CreateRefundRequest;

/**
 * Order status
 */
export type OrderStatus =
  | 'preparing'
  | 'requires_payment'
  | 'paid'
  | 'completed'
  | 'canceled'
  | 'expired'
  | 'unknown';

/**
 * Checkout settings
 */
export interface CheckoutSettings {
  redirect_url?: string;
  cancel_url?: string;
}

/**
 * Line item group summarizing items and totals
 */
export interface LineItemGroup {
  line_items: LineItem[];
  total: Amount;
}

/**
 * Invoice format details
 */
export interface InvoiceFormatDetails {
  url: string;
  first_seen_at?: string;
  last_seen_at?: string;
}

/**
 * Invoice details
 */
export interface Invoice {
  id?: string;
  number?: string;
  deliveries?: {
    id?: string;
    format?: string;
    sent_at?: string;
    sender_id?: string;
    sent_via?: string;
    sent_to?: string;
  }[];
  format?: {
    web?: InvoiceFormatDetails;
    pdf?: InvoiceFormatDetails;
  };
}

/**
 * Order response object
 */
export interface Order {
  /** Order ID */
  id: string;
  /** Order status */
  status: OrderStatus;
  /** Order number */
  number?: string;
  /** Receipt number */
  receipt_number?: string;
  /** Invoice rendering metadata */
  invoice_settings?: InvoiceSettings;
  /** Customer summary */
  customer?: {
    id: string;
    name: string;
    email_address: string;
    phone_number: string;
    created_at?: string;
  };
  /** Customer ID */
  customer_id?: string;
  /** Billing details */
  billing_details?: BillingDetails;
  /** Shipping information */
  shipping?: Shipping;
  /** Totals */
  total?: Amount;
  subtotal?: Amount;
  tax?: Amount;
  currency?: Currency;
  /** Order-level custom metadata */
  custom_data?: CustomData | null;
  /** Items (legacy) */
  line_items?: LineItem[];
  /** Grouped items (current spec) */
  line_item_group?: LineItemGroup;
  /** Payment details */
  payment?: Payment;
  /** Legacy payment status */
  payment_status?: PaymentStatus;
  /** Payment method ID if saved */
  payment_method_id?: string;
  /** Redirect URL */
  redirect_url?: string;
  /** Statement descriptor */
  statement_descriptor?: string;
  /** Checkout settings */
  checkout_settings?: CheckoutSettings;
  /** Lifecycle timestamps */
  initiated_at?: string;
  sealed_at?: string;
  completed_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  paid_at?: string;
  cancelled_at?: string;
  /** Invoice info */
  invoice?: Invoice;
  /** Refunds issued for this order, newest first. Omitted when none exist. */
  refunds?: Refund[];
}

/** Send order document request */
export interface OrderDocumentDeliveryRequest {
  order_id: string;
}

/** Order document delivery attempt */
export interface OrderDocumentDeliveryAttempt {
  channel: string;
  chime_id?: string;
  error?: string;
}

/** Order document delivery details */
export interface OrderDocumentDelivery {
  document_kind: string;
  document_url: string;
  sent_channels: string[];
  failed_channels?: string[];
  deliveries?: OrderDocumentDeliveryAttempt[];
  failures?: OrderDocumentDeliveryAttempt[];
}

/** Result of sending an order document. */
export interface OrderDocumentDeliveryResult {
  order: Order;
  delivery: OrderDocumentDelivery;
}

/** Page orders request */
export interface PageOrdersRequest {
  page_number?: number;
  page_size?: number;
  customer_id?: string;
}

/** A page of orders returned by the Orders resource. */
export interface OrderPage {
  number?: number;
  size?: number;
  orders?: Order[];
}
