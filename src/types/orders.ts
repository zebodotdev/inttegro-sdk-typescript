import {
  Currency,
  CustomData,
  MoneyAmount,
  PaymentMethodType,
  ProductType,
  RequestMeta,
} from './common';
import { BalanceTransaction } from './balance-transactions';
import {
  PaymentMethodBankAccount,
  PaymentMethodCard,
  PaymentMethodData,
  PaymentMethodMobileMoney,
  MobileMoneyNetwork,
  PaymentMethodVerification,
} from './payment-methods';
import { Address, CustomerData } from './customer';
import { BankAccountConfig, FinancialAccountType, WalletType } from './financial-accounts';
import type { PaymentAttemptStatus, PaymentConfirmationChannel } from './api-enums';
import type { Refund } from './refunds';

/**
 * Product line item
 */
export interface Product {
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
  price: MoneyAmount;
  /** Arbitrary custom data */
  custom_data?: CustomData;
}

/**
 * Fee line item
 */
export interface Fee {
  /** Fee identifier */
  id?: string;
  /** Customer-facing label */
  label?: string;
  /** Fee amount */
  amount: MoneyAmount;
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
export type LineItem =
  | {
      type: 'product';
      product: Product;
    }
  | {
      type: 'fee';
      fee: Fee;
    }
  | {
      type: 'shipping';
      shipping: ShippingDetails;
    };

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
  fee: MoneyAmount;
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
 * Payout configuration for a payment or balance transaction
 */
export interface PayoutConfiguration {
  /** Whether to enable foreign exchange conversion for this payout */
  enable_fx?: boolean;
  /** Destination financial account for payout */
  destination?: {
    /** ID of the financial account receiving the payout */
    financial_account_id?: string;
  };
}

/**
 * Base order creation request
 */
interface BaseCreateOrderRequest {
  /** Line items (products or fees) */
  line_items: LineItem[];
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
}

/**
 * Create order request with existing customer ID
 */
export interface CreateOrderWithCustomerIdRequest extends BaseCreateOrderRequest {
  /** Existing customer ID */
  customer_id: string;
  /** Optional pre-saved payment method ID */
  payment_method_id?: string;
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
  line_items?: LineItem[];
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
}

/**
 * Refund order request
 */
export interface RefundOrderRequest {
  /** Order ID to refund */
  order_id: string;
}

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
 * Payment status
 */
export type PaymentStatus =
  | 'initiated'
  | 'requires_action'
  | 'overdue'
  | 'executed'
  | 'paid'
  | 'canceled'
  | 'expired'
  | 'failed'
  | 'unknown';
export type PaymentResponseStatus =
  | 'pending'
  | 'requires_confirmation'
  | 'processing'
  | 'succeeded'
  | 'failed';

/**
 * Checkout settings
 */
export interface CheckoutSettings {
  redirect_url?: string;
  cancel_url?: string;
}

/**
 * Payment method summary
 */
export interface PaymentMethod {
  id?: string;
  customer_id?: string;
  type?: PaymentMethodType;
  mobile_money?: PaymentMethodMobileMoney | null;
  bank_account?: PaymentMethodBankAccount | null;
  card?: PaymentMethodCard | null;
  verification?: PaymentMethodVerification | null;
  custom_data?: Record<string, string>;
  expires_on?: string | null;
  verified?: boolean;
  verified_at?: string | null;
  created_at?: string;
}

/**
 * Latest payment attempt details
 */
export interface PaymentAttempt {
  payment_method_type?: PaymentMethodType;
  payment_method_id?: string;
  reference?: string;
  status?: PaymentAttemptStatus;
  initiated_at?: string;
  succeeded_at?: string;
}

/**
 * Payment intent tied to an order
 */
export interface Payment {
  id?: string;
  status?: PaymentStatus;
  statement_descriptor?: string;
  amount?: MoneyAmount;
  payment_method?: PaymentMethod;
  latest_attempt?: PaymentAttempt;
  next_action?: PaymentNextAction | null;
  payout_configuration?: PayoutConfiguration | null;
  balance_transaction?: BalanceTransaction | null;
  initiated_at?: string;
  executed_at?: string;
  paid_at?: string;
  failed_at?: string;
}

export type PaymentNextActionType =
  | 'confirm_payment'
  | 'execute'
  | 'redirect'
  | 'authorize'
  | 'none';

export interface PaymentNextAction {
  type: PaymentNextActionType;
  confirm_payment?: {
    expires_at: string;
    scheme?: string;
    request?: {
      id: string;
      recipient: string;
      sent_via: PaymentConfirmationChannel;
      token_size: number;
      sender_id: string;
    };
  };
  execute?: Record<string, unknown>;
  redirect?: {
    url: string;
  };
}

/**
 * Line item group summarizing items and totals
 */
export interface LineItemGroup {
  line_items: LineItem[];
  total: MoneyAmount;
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
  status: OrderStatus | 'paid' | 'refunded';
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
  total?: MoneyAmount;
  subtotal?: MoneyAmount;
  tax?: MoneyAmount;
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

/**
 * Create order response
 */
export interface CreateOrderResponse {
  /** Created order */
  order: Order;
  /** Redirect URL if payment requires user action */
  redirect_url?: string;
}

/**
 * Lookup order response
 */
export interface LookupOrderResponse {
  /** Order details */
  order: Order;
}

/**
 * Update order response
 */
export interface UpdateOrderResponse {
  /** Updated order */
  order: Order;
}

/**
 * Pay order response
 */
export interface PayOrderResponse {
  payment_id?: string;
  order_id?: string;
  status?: PaymentResponseStatus;
  requires_confirmation?: boolean;
  confirmation_sent?: boolean;
}

/**
 * Confirm payment response
 */
export interface ConfirmPaymentResponse {
  /** Updated order */
  order: Order;
}

/**
 * Request confirmation response
 */
export interface RequestConfirmationResponse {}

/** Finalize order response */
export interface FinalizeOrderResponse {
  order: Order;
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

/** Send order document response */
export interface OrderDocumentDeliveryResponse {
  order: Order;
  delivery: OrderDocumentDelivery;
}

/** Complete order response */
export interface CompleteOrderResponse {
  order: Order;
}

/** Cancel order response */
export interface CancelOrderResponse {
  order: Order;
}

/** Refund order response */
export interface RefundOrderResponse {
  order: Order;
}

/** Page orders request */
export interface PageOrdersRequest {
  page_number?: number;
  page_size?: number;
}

/** Page orders response */
export interface PageOrdersResponse {
  page?: {
    number?: number;
    size?: number;
    orders?: Array<{
      id?: string;
      line_item_group?: {
        products_count?: number;
        total?: MoneyAmount;
      };
      initiated_at?: string;
      completed_at?: string;
      sealed_at?: string;
      status?: string;
      customer?: {
        id?: string;
        name?: string;
        email?: string;
        phone_number?: string;
        suffix?: string;
        title?: string;
      };
    }>;
  };
}
