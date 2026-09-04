/**
 * Mock data and responses for testing
 */

import { Order, Chime, FinancialAccount, PaymentStatuses, OrderStatuses } from '../types';

/**
 * Mock order object
 */
export const mockOrder: Order = {
  id: 'or_test_123456789',
  number: 'ORD-001',
  status: OrderStatuses.Preparing,
  paymentStatus: PaymentStatuses.Initiated,
  customerId: 'cu_test_123',
  lineItems: [
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
  billingDetails: {
    emailAddress: 'test@example.com',
    phoneNumber: '0559714200',
    name: 'Test User',
    address: {
      name: 'Test User',
      phoneNumber: '0559714200',
      line1: '123 Test St',
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  },
  shipping: {
    address: {
      name: 'Test User',
      phoneNumber: '0559714200',
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
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Mock create order response
 */
export const mockCreateOrderResponse = {
  order: mockOrder,
  redirectUrl: 'https://payment.inttegro.com/checkout/test_123',
};

/**
 * Mock lookup order response
 */
export const mockLookupOrderResponse = {
  order: {
    ...mockOrder,
    paymentStatus: PaymentStatuses.Paid,
    paidAt: '2024-01-01T00:05:00Z',
  },
};

/**
 * Mock pay order response
 */
export const mockPayOrderResponse = {
  order: {
    ...mockOrder,
    paymentStatus: PaymentStatuses.RequiresAction,
  },
};

/**
 * Mock confirm payment response
 */
export const mockConfirmPaymentResponse = {
  order: {
    ...mockOrder,
    paymentStatus: PaymentStatuses.Paid,
    paidAt: '2024-01-01T00:05:00Z',
  },
};

/**
 * Mock request confirmation response
 */
export const mockRequestConfirmationResponse = {
  order: mockOrder,
};

export const mockChimeResponse = {
  chime: {
    id: 'ch_123',
    fullMessage: 'hello there',
    senderId: 'YourBrand',
    transmission: {
      sentVia: 'sms',
      status: 'sent',
      createdAt: '2025-12-10T10:30:00Z',
      sentAt: '2025-12-10T10:30:05Z',
      deliveredAt: null,
      failedAt: null,
    },
  },
} satisfies { chime: Chime };

export const mockScheduleResponse = {
  scheduledChime: {
    id: 'sch_123',
    recipients: ['+233244123456'],
    fullMessage: 'Hello! This is your scheduled reminder.',
    senderId: 'YourBrand',
    sendAfter: '2026-01-18T10:00:00Z',
    createdAt: '2026-01-17T15:30:00Z',
    executedAt: null,
  },
};

export const mockScheduleLookupResponse = {
  scheduledChime: {
    id: 'sch_123',
    recipients: ['+233244123456'],
    content: 'Hello! This is your scheduled reminder.',
    senderId: 'YourBrand',
    sendAfter: '2026-01-18T10:00:00Z',
    createdAt: '2026-01-17T15:30:00Z',
    executedAt: null,
    canceledAt: null,
    errors: [],
    chimeIds: [],
  },
};

export const mockBroadcastResponse = {
  broadcast: {
    id: 'brc_123',
    recipients: ['+233244123456'],
    content: 'Hello! This is your broadcast notification.',
    senderId: 'YourBrand',
    sendAfter: '2026-01-18T10:00:00Z',
    createdAt: '2026-01-18T10:00:00Z',
    executedAt: null,
    canceledAt: null,
    errors: [],
    chimeIds: [],
  },
};

export const mockFinancialAccountResponse = {
  account: {
    id: 'fa_123',
    label: 'My Wallet',
    type: 'wallet',
    reference: 'REF-2024-001',
    currency: 'ghs',
  },
} satisfies { account: FinancialAccount };

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
    fixCode: 'change_request_parameters',
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
