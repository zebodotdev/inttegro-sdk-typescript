# Typescript SDK for the Commerce API

Official TypeScript SDK for the [Zebo Commerce API](https://api.zebo.dev). Build powerful commerce applications with type-safe, modern JavaScript/TypeScript.

## Features

- ✨ **Full TypeScript support** with comprehensive type definitions
- 🔄 **Automatic retry logic** with exponential backoff
- ⚡ **Modern async/await API**
- 🛡️ **Built-in error handling** with custom error classes
- 🔌 **Request/response interceptors** for middleware functionality
- 📦 **Dual module support** (CommonJS and ESM)
- 🧪 **Thoroughly tested** with >80% code coverage
- 📝 **Comprehensive JSDoc documentation**

## Installation

```bash
npm install @preciousewusi/commerce-sdk-typescript
```

Or with yarn:

```bash
yarn add @preciousewusi/commerce-sdk-typescript
```

Or with pnpm:

```bash
pnpm add @preciousewusi/commerce-sdk-typescript
```

## Quick Start

```typescript
import { CommerceClient } from '@zebo/commerce-sdk';

// Initialize the client
const commerce = new CommerceClient({
  apiKey: 'your-api-key',
});

// Create an order
const order = await commerce.orders.create({
  customer_data: {
    name: 'John Doe',
    email_address: 'john@example.com',
    phone_number: '0559714200',
  },
  line_items: [
    {
      type: 'product',
      product: {
        type: 'physical',
        quantity: 1,
        name: 'Premium Widget',
        price: { currency: 'ghs', value: 20000 }, // GHS 200.00
      },
    },
  ],
  billing_details: {
    email_address: 'john@example.com',
    phone_number: '0559714200',
    name: 'John Doe',
    address: {
      name: 'John Doe',
      phone_number: '0559714200',
      line1: '123 Main Street',
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  },
  payout_settings: {
    destination: {
      financial_account_id: 'fa_1234567890abcdef',
    },
    enable_fx: false,
  },
  execute_payment: true,
});

console.log('Order created:', order.order.id);
```

## Configuration

### Basic Configuration

```typescript
const commerce = new CommerceClient({
  apiKey: 'your-api-key', // Required
  baseUrl: 'https://api.zebo.dev', // Optional, defaults to production
  timeout: 30000, // Optional, request timeout in milliseconds
  debug: false, // Optional, enable debug logging
});
```

### Retry Configuration

The SDK automatically retries failed requests with exponential backoff:

```typescript
const commerce = new CommerceClient({
  apiKey: 'your-api-key',
  retry: {
    maxRetries: 3, // Maximum retry attempts
    initialDelay: 1000, // Initial delay in milliseconds
    maxDelay: 10000, // Maximum delay in milliseconds
    backoffMultiplier: 2, // Exponential backoff multiplier
  },
});
```

### Dynamic Configuration Updates

```typescript
// Update configuration after initialization
commerce.updateConfig({
  timeout: 60000,
  debug: true,
});
```

## API Reference

### Orders

The Orders resource allows you to create and manage orders.

#### Create Order

Create a new order with either a new customer or existing customer ID.

**With new customer:**

```typescript
const order = await commerce.orders.create({
  customer_data: {
    name: 'John Doe',
    email_address: 'john@example.com',
    phone_number: '0559714200',
    reference: 'customer-ref-123', // Optional
    custom_data: { source: 'web' }, // Optional
  },
  line_items: [
    {
      type: 'product',
      product: {
        type: 'physical', // or 'digital'
        quantity: 2,
        name: 'Premium Widget',
        about: 'High-quality widget', // Optional
        reference: 'WIDGET-001', // Optional
        price: { currency: 'ghs', value: 20000 },
        tax_code: 'TAX001', // Optional
        custom_data: { sku: 'WIDGET-001' }, // Optional
      },
    },
    {
      type: 'fee',
      fee: {
        amount: { currency: 'ghs', value: 1000 },
        description: 'Processing fee',
      },
    },
  ],
  billing_details: {
    email_address: 'john@example.com',
    phone_number: '0559714200',
    name: 'John Doe',
    address: {
      name: 'John Doe',
      phone_number: '0559714200',
      line1: '123 Main Street',
      line2: 'Apt 4B', // Optional
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
      district: 'Accra Metro', // Optional
      post_code: '00233', // Optional
    },
  },
  payout_settings: {
    destination: {
      financial_account_id: 'fa_1234567890abcdef',
    },
    enable_fx: false,
  },
  shipping: {
    // Required for physical products
    address: {
      name: 'John Doe',
      phone_number: '0559714200',
      line1: '456 Delivery St',
      town: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  },
  number: 'ORD-2024-001', // Optional custom order number
  statement_descriptor: 'MYSHOP*ORDER', // Optional
  execute_payment: true, // Optional, immediately execute payment
  idempotency_key: 'unique-key-123', // Optional
  redirect_url: 'https://myapp.com/return', // Optional
});
```

### Chimes, Schedules, Broadcasts

Send chimes immediately, schedule them for later, or inspect/cancel scheduled/broadcast deliveries.

```typescript
// Schedule a chime
const scheduled = await commerce.chimes.schedule({
  recipients: ['+233244123456', 'user@example.com'],
  full_message: 'Hello! This is your scheduled reminder.',
  send_after: '2026-01-18T10:00:00Z',
  sender_id: 'YourBrand',
});

// Lookup or cancel a scheduled chime
const scheduleInfo = await commerce.schedules.lookup({ schedule_id: 'sch_abc123def456ghi789' });
const canceledSchedule = await commerce.schedules.cancel({ schedule_id: 'sch_abc123def456ghi789' });

// Lookup or cancel a broadcast
const broadcastInfo = await commerce.broadcasts.lookup({ broadcast_id: 'brc_abc123def456ghi789' });
const canceledBroadcast = await commerce.broadcasts.cancel({ broadcast_id: 'brc_abc123def456ghi789' });
```
**With existing customer:**

```typescript
const order = await commerce.orders.create({
  customer_id: 'cu_123456789',
  payment_method_id: 'pm_123456789', // Optional
  payout_settings: {
    destination: {
      financial_account_id: 'fa_1234567890abcdef',
    },
    enable_fx: false,
  },
  line_items: [
    /* ... */
  ],
  billing_details: {
    /* ... */
  },
});
```

#### Lookup Order

Retrieve order details by ID:

```typescript
const orderDetails = await commerce.orders.lookup({
  order_id: 'or_123456789',
});

console.log('Order status:', orderDetails.order.status);
console.log('Payment status:', orderDetails.order.payment_status);
```

#### Pay for Order

Pay for an existing order, either with inline payment method data or a saved payment method.

**With mobile money:**

```typescript
const payment = await commerce.orders.pay({
  order_id: 'or_123456789',
  payment_method_data: {
    type: 'mobile_money',
    mobile_money: {
      issuer: 'mtn', // 'mtn', 'vodafone', 'airteltigo'
      number: '0544998605',
    },
  },
});

if (payment.requires_confirmation) {
  console.log('Confirmation required. Redirect:', payment.redirect_url);
}
```

**With saved payment method:**

```typescript
const payment = await commerce.orders.pay({
  order_id: 'or_123456789',
});
```

#### Confirm Payment

Confirm a payment that requires additional verification (e.g., OTP):

```typescript
const result = await commerce.orders.confirmPayment({
  order_id: 'or_123456789',
  token: '123456', // OTP or confirmation token
});

if (result.success) {
  console.log('Payment confirmed!');
}
```

#### Request Confirmation

Request a new confirmation token (e.g., resend OTP):

```typescript
const result = await commerce.orders.requestConfirmation({
  order_id: 'or_123456789',
});

console.log(result.message);
```

### Financial Accounts

```typescript
const account = await commerce.financialAccounts.connect({
  label: 'Primary GHS Bank Account',
  type: 'bank_account',
  reference: 'BANK-GHS-001',
  currency: 'ghs',
  owner: {
    name: 'Jane Smith',
    address: {
      name: 'Business Address',
      line_1: '456 Business Road',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
    },
  },
  custom_data: { merchant_id: 'merch_123' },
  pull_configuration: { enabled: true, mandate: {} },
  bank_account: {
    type: 'ghana_bank_account',
    ghana_bank_account: {
      number: '1234567890',
      sort_code: '040127',
      holder: {
        name: 'Jane Smith',
        address: {
          name: 'Business Address',
          line_1: '456 Business Road',
          city: 'Accra',
          region: 'Greater Accra',
          country: 'Ghana',
        },
      },
    },
  },
});

// Disable push configuration (optionally remove from payout destinations first)
await commerce.financialAccounts.disablePush({
  account_id: 'fa_1234567890abcdef',
  unset_as_payout_destination: true,
});

// Disconnect a financial account
await commerce.financialAccounts.disconnect({
  account_id: 'fa_1234567890abcdef',
  unset_as_payout_destination: true,
});
```

### Customers

```typescript
const customer = await commerce.customers.create({
  name: 'Jane Doe',
  email_address: 'jane@example.com',
  phone_number: '+233501234567',
});

const existing = await commerce.customers.lookup({ customer_id: customer.customer?.id ?? '' });
const page = await commerce.customers.page({ page_number: 1, page_size: 50 });
```

### Products

```typescript
const product = await commerce.products.create({
  type: 'physical',
  name: 'Premium Cotton T-Shirt',
});

await commerce.products.addPrice({
  product_id: product.product?.id ?? '',
  amount: { currency: 'ghs', value: 5000 },
  set_as_default: true,
});

const productsPage = await commerce.products.page({ page_number: 1, page_size: 50 });

await commerce.products.publish({ product_id: product.product?.id ?? '' });
```

### Prices

```typescript
const price = await commerce.prices.create({
  currency: 'USD',
  amount: 1999,
  label: 'Standard pricing',
});

await commerce.prices.update({
  price_id: price.price?.id ?? '',
  label: 'Premium pricing',
});
```

## Error Handling

The SDK provides comprehensive error handling with custom error classes:

```typescript
import {
  CommerceAPIError,
  CommerceValidationError,
  CommerceNetworkError,
  CommerceAuthenticationError,
  CommerceRateLimitError,
} from '@zebo/commerce-sdk';

try {
  const order = await commerce.orders.create({
    /* ... */
  });
} catch (error) {
  if (error instanceof CommerceValidationError) {
    console.error('Validation error:', error.message);
    console.error('Detail:', error.detail);
    console.error('Fix:', error.fixCode);
    console.error('Docs:', error.url);
  } else if (error instanceof CommerceAuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof CommerceRateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter);
  } else if (error instanceof CommerceNetworkError) {
    console.error('Network error:', error.message);
    console.error('Is timeout:', error.isTimeout);
  } else if (error instanceof CommerceAPIError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Error code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Advanced Usage

### Request Interceptors

Add custom logic before requests are sent:

```typescript
commerce.addRequestInterceptor((url, options) => {
  // Add custom headers
  options.headers = {
    ...options.headers,
    'X-Custom-Header': 'value',
  };

  // Log requests in debug mode
  console.log(`Making request to: ${url}`);

  return { url, options };
});
```

### Response Interceptors

Process responses before they're returned:

```typescript
commerce.addResponseInterceptor((response) => {
  // Log response status
  console.log('Response status:', response.status);

  // Track API usage
  const requestId = response.headers.get('x-request-id');
  if (requestId) {
    console.log('Request ID:', requestId);
  }

  return response;
});
```

### Idempotency

Use idempotency keys to safely retry requests:

```typescript
import { generateIdempotencyKey } from '@zebo/commerce-sdk';

const idempotencyKey = generateIdempotencyKey();

const order = await commerce.orders.create({
  // ... order data
  idempotency_key: idempotencyKey,
});
```

### Money Amounts

All monetary values use minor units (e.g., pesewas for GHS):

```typescript
// GHS 100.50 = 10050 pesewas
const price = {
  currency: 'ghs',
  value: 10050,
};

// GHS 200.00 = 20000 pesewas
const amount = {
  currency: 'ghs',
  value: 20000,
};
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  Order,
  CreateOrderRequest,
  PaymentMethodData,
  MoneyAmount,
  LineItem,
} from '@zebo/commerce-sdk';

// Full IntelliSense support
const lineItem: LineItem = {
  type: 'product',
  product: {
    type: 'physical',
    quantity: 1,
    name: 'Product',
    price: { currency: 'ghs', value: 10000 },
  },
};
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run typecheck
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

- [Basic order creation](./examples/basic-order.ts)
- [Mobile money payment](./examples/mobile-money-payment.ts)
- [Payment confirmation flow](./examples/payment-confirmation.ts)
- [Error handling](./examples/error-handling.ts)

## API Versioning

The SDK targets API version `v1`. Future versions will be supported through separate package versions.

## Support

- 📧 Email: support@zebo.dev
- 📚 Documentation: https://studio.zebo.dev
- 🐛 Issues: https://github.com/zebo/commerce-sdk-typescript/issues

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes.
