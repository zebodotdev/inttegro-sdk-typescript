/**
 * Orders resource for creating and managing orders and payments.
 *
 * Orders represent a complete transaction with line items, customer information, and payment details.
 * Use this resource to create orders, process payments, handle confirmations, and manage the order lifecycle.
 *
 * @example
 * ```typescript
 * const commerce = new Commerce(process.env.COMMERCE_API_KEY!);
 *
 * // Create order with new customer and payment method
 * const order = await commerce.orders.create({
 *   customer_data: {
 *     name: 'Gloria Kesewaa',
 *     email_address: 'gloria@example.com',
 *     phone_number: '+233544998605',
 *   },
 *   line_items: [{
 *     type: 'product',
 *     product: {
 *       type: 'physical',
 *       name: 'Utility Sneakers',
 *       quantity: 1,
 *       price: { currency: 'ghs', value: 20000 },
 *     },
 *   }],
 *   payment_method_data: {
 *     type: 'mobile_money',
 *     mobile_money: {
 *       network: 'mtn',
 *       account_number: '0544998605',
 *     },
 *   },
 *   execute_payment: true,
 * });
 * ```
 *
 * @see https://commerce.zebo.dev/orders for detailed guides
 */

import { HttpClient } from '../http-client';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  LookupOrderRequest,
  LookupOrderResponse,
  PayOrder,
  PayOrderResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  RequestConfirmationRequest,
  RequestConfirmationResponse,
  FinalizeOrderRequest,
  FinalizeOrderResponse,
  OrderDocumentDeliveryRequest,
  OrderDocumentDeliveryResponse,
  CompleteOrderRequest,
  CompleteOrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  RefundOrderRequest,
  RefundOrderResponse,
  PageOrdersRequest,
  PageOrdersResponse,
} from '../types';
import { validateRequired, throwIfValidationErrors } from '../utils/validation';

/**
 * Orders resource for managing complete order lifecycle operations.
 */
export class Orders {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create a new order with line items, customer, and optional payment details.
   *
   * Creates an order representing a purchase. Supports two flows:
   * 1. New customer: Provide `customer_data` to create a new customer and order
   * 2. Existing customer: Provide `customer_id` and optionally `payment_method_id` for known customers
   *
   * Set `execute_payment` to `true` to immediately charge the customer after order creation. The order can
   * be configured with checkout redirect URLs for hosted payment flows.
   *
   * @param request - Order creation parameters
   * @param request.customer_data - New customer information (required if `customer_id` not provided)
   * @param request.customer_id - Existing customer ID (required if `customer_data` not provided)
   * @param request.line_items - Array of products, fees, or shipping charges (required, minimum 1)
   * @param request.payment_method_data - Inline payment method details (mobile money, card, etc.)
   * @param request.payment_method_id - ID of saved payment method to use
   * @param request.execute_payment - Whether to execute payment immediately (default: false)
   * @param request.finalize - Whether to explicitly finalize the order regardless of payment state (default: false)
   * @param request.request_meta - Request controls such as `idempotency_key`
   * @param request.number - Optional order number for reference (e.g., "ORDER-123")
   * @param request.statement_descriptor - Text that appears on customer's bank statement (max 22 characters)
   * @param request.statement_descriptor_prefix - Static prefix, 2-10 characters, used to build `prefix*order_id`; mutually exclusive with `statement_descriptor`
   * @param request.checkout_settings - Checkout flow configuration with `redirect_url` and `cancel_url`
   * @param request.custom_data - Key-value custom data (max 25KB, keys and values must be strings)
   *
   * @returns Created order with customer, line items, payment intent (if applicable), and optional redirect URL
   *
   * @throws {ValidationError} If required fields are missing or invalid
   * @throws {ApiError} If the API request fails
   *
   * @example
   * ```typescript
   * // Create order with new customer and execute payment
   * const result = await commerce.orders.create({
   *   request_meta: {
   *     idempotency_key: 'order_2025_001',
   *   },
   *   execute_payment: true,
   *   customer_data: {
   *     name: 'Gloria Kesewaa',
   *     email_address: 'gloria@example.com',
   *     phone_number: '+233544998605',
   *   },
   *   payment_method_data: {
   *     type: 'mobile_money',
   *     mobile_money: {
   *       network: 'mtn',
   *       account_number: '0544998605',
   *     },
   *   },
   *   line_items: [{
   *     type: 'product',
   *     product: {
   *       type: 'physical',
   *       name: 'Utility Sneakers',
   *       quantity: 1,
   *       price: { currency: 'ghs', value: 20000 },
   *     },
   *   }],
   *   checkout_settings: {
   *     redirect_url: 'https://example.com/order/complete',
   *     cancel_url: 'https://example.com/order/cancelled',
   *   },
   * });
   *
   * const order = result.order;
   * console.log(`Created order: ${order.id}`);
   * ```
   *
   * @example
   * ```typescript
   * // Create order with existing customer for later payment
   * const result = await commerce.orders.create({
   *   customer_id: 'cu_abc123',
   *   line_items: [{
   *     type: 'product',
   *     product: {
   *       type: 'digital',
   *       name: 'Premium Subscription',
   *       quantity: 1,
   *       price: { currency: 'ghs', value: 5000 },
   *     },
   *   }],
   * });
   * ```
   *
   * @see https://commerce.zebo.dev/accept-a-payment for payment flow guide
   * @see https://commerce.zebo.dev/order-lifecycle for order states
   */
  async create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Validate required fields
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'line_items',
      'billing_details',
    ]);

    // Validate that either customer_data or customer_id is provided
    if (!request.customer_data && !('customer_id' in request && request.customer_id)) {
      errors.push({
        field: 'customer_data/customer_id',
        message: 'Either customer_data or customer_id must be provided',
      });
    }

    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateOrderResponse>('/orders/new', request);
  }

  /**
   * Retrieve an existing order by its ID.
   *
   * Returns full order details including customer, line items, payment state, and invoice information.
   * Use this to check order status, retrieve payment details, or display order confirmation to customers.
   *
   * @param request - Lookup parameters
   * @param request.order_id - Unique identifier of the order to retrieve (required)
   *
   * @returns Complete order object with all related data
   *
   * @throws {ApiError} If order not found or request fails
   *
   * @example
   * ```typescript
   * const result = await commerce.orders.lookup({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * const order = result.order;
   * console.log(`Order status: ${order.status}`);
   * console.log(`Payment status: ${order.payment?.status}`);
   * ```
   *
   * @see https://commerce.zebo.dev/orders for API reference
   */
  async lookup(request: LookupOrderRequest): Promise<LookupOrderResponse> {
    // Validate required fields
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<LookupOrderResponse>('/orders/lookup', request);
  }

  /**
   * Initiate payment for an existing order.
   *
   * Supports three payment flows:
   * 1. Saved payment method: Provide only `order_id` to charge a previously saved payment method
   * 2. New payment method: Include `payment_method_data` with inline payment details (mobile money, card, etc.)
   * 3. Offline payment: Set `paid_out_of_band` to true for cash, bank transfer, or check payments
   *
   * When payment requires customer confirmation (e.g., OTP), the response includes a `next_action` field
   * indicating what the customer needs to do. Call `confirmPayment()` once the customer provides the token.
   *
   * @param request - Payment parameters
   * @param request.order_id - Unique identifier of the order to pay (required)
   * @param request.payment_method_data - Inline payment method details (mobile money, card, bank, etc.)
   * @param request.payment_method_id - ID of a saved payment method to use
   * @param request.paid_out_of_band - Set to true if payment was received outside Commerce (default: false)
   * @param request.request_meta - Request controls such as `idempotency_key`
   *
   * @returns Payment response with order and payment state, plus optional `next_action` if confirmation needed
   *
   * @throws {ApiError} If order not found or payment fails
   *
   * @example
   * ```typescript
   * // Pay with inline mobile money
   * const result = await commerce.orders.pay({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   *   payment_method_data: {
   *     type: 'mobile_money',
   *     mobile_money: {
   *       network: 'mtn',
   *       account_number: '0544998605',
   *     },
   *   },
   * });
   *
   * if (result.order.payment?.next_action?.type === 'confirm_payment') {
   *   // Customer needs to provide OTP sent to their phone
   *   const token = await promptCustomerForOTP();
   *   await commerce.orders.confirmPayment({
   *     order_id: result.order.id,
   *     token,
   *   });
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Pay with saved payment method
   * const result = await commerce.orders.pay({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   *   payment_method_id: 'pm_xyz123abc456',
   *   request_meta: {
   *     idempotency_key: 'order_initial_charge_001',
   *   },
   * });
   * ```
   *
   * @example
   * ```typescript
   * // Mark as paid offline (cash, bank transfer, etc.)
   * const result = await commerce.orders.pay({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   *   paid_out_of_band: true,
   * });
   * ```
   *
   * @see https://commerce.zebo.dev/accept-a-payment for payment flow guide
   * @see https://commerce.zebo.dev/charge-repeat-customers for saved payment methods
   */
  async pay(request: PayOrder): Promise<PayOrderResponse> {
    // Validate required fields
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PayOrderResponse>('/orders/pay', request);
  }

  /**
   * Confirm a pending payment using a verification token (e.g., OTP sent to customer's phone).
   *
   * Call this method when a payment requires customer confirmation and you've collected the verification
   * token from the customer. The token is typically a 6-digit OTP sent via SMS or email to the customer.
   *
   * @param request - Confirmation parameters
   * @param request.order_id - Unique identifier of the order being paid (required)
   * @param request.token - Verification token provided by the customer (required, typically 6 digits)
   * @param request.request_meta - Request controls such as `idempotency_key`
   *
   * @returns Updated order with payment status
   *
   * @throws {ApiError} If token is invalid, expired, or order not found
   *
   * @example
   * ```typescript
   * // After receiving OTP from customer
   * const result = await commerce.orders.confirmPayment({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   *   token: '123456',
   * });
   *
   * if (result.order.payment?.status === 'succeeded') {
   *   console.log('Payment confirmed successfully!');
   * }
   * ```
   *
   * @see https://commerce.zebo.dev/accept-a-payment for complete payment flow
   */
  async confirmPayment(request: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
    // Validate required fields
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'order_id',
      'token',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ConfirmPaymentResponse>('/orders/confirm_payment', request);
  }

  /**
   * Request a new confirmation token to be sent to the customer (e.g., resend OTP).
   *
   * Use this when the customer didn't receive the original OTP or the token expired. A fresh verification
   * token will be sent via SMS or email to the customer's registered contact information.
   *
   * @param request - Request parameters
   * @param request.order_id - Unique identifier of the order requiring confirmation (required)
   * @param request.request_meta - Request controls such as `idempotency_key`
   *
   * @returns Response indicating token was resent
   *
   * @throws {ApiError} If order not found or not in confirmable state
   *
   * @example
   * ```typescript
   * // Resend OTP to customer
   * const result = await commerce.orders.requestConfirmation({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * console.log('New OTP sent to customer');
   * ```
   *
   * @see https://commerce.zebo.dev/accept-a-payment for payment confirmation flow
   */
  async requestConfirmation(
    request: RequestConfirmationRequest
  ): Promise<RequestConfirmationResponse> {
    // Validate required fields
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RequestConfirmationResponse>('/orders/request_confirmation', request);
  }

  /**
   * Finalize an order to make it immutable and ready for payment or fulfillment.
   *
   * Finalizing (sealing) an order locks its line items and totals, making it ready for payment execution
   * or order completion. Most orders are finalized automatically, but you can explicitly finalize an
   * order if needed.
   *
   * @param request - Finalization parameters
   * @param request.order_id - Unique identifier of the order to finalize (required)
   * @param request.request_meta - Request controls such as `idempotency_key`
   *
   * @returns Finalized order object
   *
   * @throws {ApiError} If order not found or already finalized
   *
   * @example
   * ```typescript
   * const result = await commerce.orders.finalize({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * console.log(`Order finalized at: ${result.order.sealed_at}`);
   * ```
   *
   * @see https://commerce.zebo.dev/order-lifecycle for order states
   */
  async finalize(request: FinalizeOrderRequest): Promise<FinalizeOrderResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<FinalizeOrderResponse>('/orders/finalize', request);
  }

  /**
   * Send the hosted invoice link for an existing order to the customer.
   *
   * Commerce delivers the invoice link to every contact method available on the order customer.
   *
   * @param request - Send invoice parameters
   * @param request.order_id - Unique identifier of the order whose invoice should be sent (required)
   *
   * @returns The order and document delivery details
   *
   * @throws {ApiError} If order not found, customer has no contact method, or delivery fails
   */
  async sendInvoice(
    request: OrderDocumentDeliveryRequest
  ): Promise<OrderDocumentDeliveryResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<OrderDocumentDeliveryResponse>('/orders/send_invoice', request);
  }

  /**
   * Send the hosted receipt link for a paid order to the customer.
   *
   * Commerce delivers receipts only after the order has been paid.
   *
   * @param request - Send receipt parameters
   * @param request.order_id - Unique identifier of the paid order whose receipt should be sent (required)
   *
   * @returns The order and document delivery details
   *
   * @throws {ApiError} If order not found, unpaid, customer has no contact method, or delivery fails
   */
  async sendReceipt(
    request: OrderDocumentDeliveryRequest
  ): Promise<OrderDocumentDeliveryResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<OrderDocumentDeliveryResponse>('/orders/send_receipt', request);
  }

  /**
   * Mark an order as completed, indicating fulfillment is done.
   *
   * Call this after you've shipped physical goods or delivered digital products to the customer.
   * Completing an order transitions it to its final state and can optionally mark payment as received
   * offline (out-of-band) if `paid_out_of_band` is set to true.
   *
   * @param request - Completion parameters
   * @param request.order_id - Unique identifier of the order to complete (required)
   * @param request.paid_out_of_band - Set to true if payment was received outside Commerce (default: false)
   *
   * @returns Completed order object
   *
   * @throws {ApiError} If order not found, not paid, or already completed
   *
   * @example
   * ```typescript
   * // Complete order after fulfillment
   * const result = await commerce.orders.complete({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * console.log(`Order completed at: ${result.order.completed_at}`);
   * ```
   *
   * @example
   * ```typescript
   * // Complete order with offline payment
   * const result = await commerce.orders.complete({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   *   paid_out_of_band: true,
   * });
   * ```
   *
   * @see https://commerce.zebo.dev/order-lifecycle for order states
   */
  async complete(request: CompleteOrderRequest): Promise<CompleteOrderResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CompleteOrderResponse>('/orders/complete', request);
  }

  /**
   * Cancel an order, stopping payment execution and preventing further processing.
   *
   * Canceling an order is irreversible and should be done when the customer requests cancellation or
   * the order cannot be fulfilled. If payment was already captured, you'll need to refund it separately.
   *
   * @param request - Cancellation parameters
   * @param request.order_id - Unique identifier of the order to cancel (required)
   * @param request.request_meta - Request controls such as `idempotency_key`
   *
   * @returns Cancelled order object
   *
   * @throws {ApiError} If order not found, already completed, or cannot be cancelled
   *
   * @example
   * ```typescript
   * const result = await commerce.orders.cancel({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * console.log(`Order ${result.order.id} has been cancelled`);
   * ```
   *
   * @see https://commerce.zebo.dev/order-lifecycle for order states
   */
  async cancel(request: CancelOrderRequest): Promise<CancelOrderResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CancelOrderResponse>('/orders/cancel', request);
  }

  /**
   * Refund a paid order, returning funds to the customer.
   *
   * Refunds the payment associated with an order, sending funds back to the customer's original payment
   * method. The order must have been successfully paid before it can be refunded.
   *
   * @param request - Refund parameters
   * @param request.order_id - Unique identifier of the order to refund (required)
   *
   * @returns Refunded order object with updated payment status
   *
   * @throws {ApiError} If order not found, not paid, or refund fails
   *
   * @example
   * ```typescript
   * const result = await commerce.orders.refund({
   *   order_id: 'GKj7A8lM5wEGRUvbqpI4bkDFsQvpqVyh5fqePNnb',
   * });
   *
   * console.log(`Order refunded. Refund ID: ${result.order.payment?.refund?.id}`);
   * ```
   *
   * @see https://commerce.zebo.dev/retry-a-payment for payment retry guide
   */
  async refund(request: RefundOrderRequest): Promise<RefundOrderResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['order_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RefundOrderResponse>('/orders/refund', request);
  }

  /**
   * Retrieve a paginated list of orders.
   *
   * Returns orders in reverse chronological order (most recent first). Use the `has_more` field
   * and `page` parameter to navigate through results. Supports filtering by status and time range.
   *
   * @param request - Pagination and filter parameters (optional)
   * @param request.page - Page number to retrieve (minimum 1, default: 1)
   * @param request.per_page - Number of results per page (minimum 1, maximum 100, default: 10)
   * @param request.status - Filter by order status (e.g., 'paid', 'requires_payment', 'completed')
   * @param request.created_after - Filter orders created after this timestamp (ISO 8601)
   * @param request.created_before - Filter orders created before this timestamp (ISO 8601)
   *
   * @returns Paginated list of orders with pagination details
   *
   * @throws {ApiError} If pagination parameters are invalid
   *
   * @example
   * ```typescript
   * // Get first page of orders
   * const result = await commerce.orders.page({
   *   per_page: 25,
   *   page: 1,
   * });
   *
   * console.log(`Retrieved ${result.orders.length} orders`);
   * console.log(`Has more: ${result.has_more}`);
   *
   * // Get next page if available
   * if (result.has_more) {
   *   const nextPage = await commerce.orders.page({
   *     per_page: 25,
   *     page: 2,
   *   });
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Filter by status
   * const paidOrders = await commerce.orders.page({
   *   status: 'paid',
   *   per_page: 50,
   * });
   * ```
   *
   * @see https://commerce.zebo.dev/pagination for pagination guide
   * @see https://commerce.zebo.dev/orders for API reference
   */
  async page(request: PageOrdersRequest = {}): Promise<PageOrdersResponse> {
    return this.httpClient.post<PageOrdersResponse>('/orders/page', request);
  }
}
