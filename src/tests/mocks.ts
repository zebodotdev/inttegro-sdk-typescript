/**
 * Mock data and responses for testing
 */

import {
  Order,
  CreateOrderResponse,
  LookupOrderResponse,
  PayOrderResponse,
  ConfirmPaymentResponse,
  RequestConfirmationResponse,
  ChimeResponse,
  CreateFinancialAccountResponse,
  OrderPaymentStatuses,
  OrderStatuses,
} from '../types';

/**
 * Mock order object
 */
export const mockOrder: Order = {
  id: 'or_test_123456789',
  number: 'ORD-001',
  status: OrderStatuses.Preparing,
  payment_status: OrderPaymentStatuses.Initiated,
  customer_id: 'cu_test_123',
  line_items: [
    {
      type: 'product',
      product: {
        type: 'physical',
        quantity: 1,
        name: 'Test Product',
        price: {
          currency: 'ghs',
          value: 20000,
        },
      },
    },
  ],
  billing_details: {
    email_address: 'test@example.com',
    phone_number: '0559714200',
    name: 'Test User',
    address: {
      name: 'Test User',
      phone_number: '0559714200',
      line1: '123 Test St',
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  },
  shipping: {
    address: {
      name: 'Test User',
      phone_number: '0559714200',
      line1: '123 Test St',
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  },
  total: {
    currency: 'ghs',
    value: 20000,
  },
  subtotal: {
    currency: 'ghs',
    value: 20000,
  },
  currency: 'ghs',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Mock create order response
 */
export const mockCreateOrderResponse: CreateOrderResponse = {
  order: mockOrder,
  redirect_url: 'https://payment.inttegro.com/checkout/test_123',
};

/**
 * Mock lookup order response
 */
export const mockLookupOrderResponse: LookupOrderResponse = {
  order: {
    ...mockOrder,
    payment_status: OrderPaymentStatuses.Paid,
    paid_at: '2024-01-01T00:05:00Z',
  },
};

/**
 * Mock pay order response
 */
export const mockPayOrderResponse: PayOrderResponse = {
  payment_id: 'py_123',
  order_id: 'or_test_123456789',
  status: 'requires_confirmation',
  requires_confirmation: true,
  confirmation_sent: true,
};

/**
 * Mock confirm payment response
 */
export const mockConfirmPaymentResponse: ConfirmPaymentResponse = {
  order: {
    ...mockOrder,
    payment_status: OrderPaymentStatuses.Paid,
    paid_at: '2024-01-01T00:05:00Z',
  },
};

/**
 * Mock request confirmation response
 */
export const mockRequestConfirmationResponse: RequestConfirmationResponse = {};

export const mockChimeResponse: ChimeResponse = {
  chime: {
    id: 'ch_123',
    full_message: 'hello there',
    sender_id: 'YourBrand',
    transmission: {
      sent_via: 'sms',
      status: 'sent',
      created_at: '2025-12-10T10:30:00Z',
      sent_at: '2025-12-10T10:30:05Z',
      delivered_at: null,
      failed_at: null,
    },
  },
};

export const mockScheduleResponse = {
  scheduled_chime: {
    id: 'sch_123',
    recipients: ['+233244123456'],
    full_message: 'Hello! This is your scheduled reminder.',
    sender_id: 'YourBrand',
    send_after: '2026-01-18T10:00:00Z',
    created_at: '2026-01-17T15:30:00Z',
    executed_at: null,
  },
};

export const mockScheduleLookupResponse = {
  scheduled_chime: {
    id: 'sch_123',
    recipients: ['+233244123456'],
    content: 'Hello! This is your scheduled reminder.',
    sender_id: 'YourBrand',
    send_after: '2026-01-18T10:00:00Z',
    created_at: '2026-01-17T15:30:00Z',
    executed_at: null,
    canceled_at: null,
    errors: [],
    chime_ids: [],
  },
};

export const mockBroadcastResponse = {
  broadcast: {
    id: 'brc_123',
    recipients: ['+233244123456'],
    content: 'Hello! This is your broadcast notification.',
    sender_id: 'YourBrand',
    send_after: '2026-01-18T10:00:00Z',
    created_at: '2026-01-18T10:00:00Z',
    executed_at: null,
    canceled_at: null,
    errors: [],
    chime_ids: [],
  },
};

export const mockFinancialAccountResponse: CreateFinancialAccountResponse = {
  account: {
    id: 'fa_123',
    label: 'My Wallet',
    type: 'wallet',
    reference: 'REF-2024-001',
    currency: 'ghs',
  },
};

/**
 * Mock error response
 */
export const mockErrorResponse = {
  error: {
    message: 'Invalid payment method',
    code: 'invalid_payment_method',
    type: 'invalid_request_parameter',
    url: 'https://studio.inttegro.com/e/invalid_payment_method',
    detail: 'Payment method not supported for this currency.',
    fix_code: 'change_request_parameters',
    cause: 'validation_failure',
  },
};

/**
 * Create a mock fetch function
 */
export function createMockFetch(
  responseData: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return async (): Promise<Response> => {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: new Headers({
        'content-type': 'application/json',
        ...headers,
      }),
      json: async () => responseData,
      text: async () => JSON.stringify(responseData),
    } as Response;
  };
}
