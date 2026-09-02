# Inttegro TypeScript SDK

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/zebodotdev/inttegro-sdk-typescript/badge)](https://scorecard.dev/viewer/?uri=github.com/zebodotdev/inttegro-sdk-typescript)

The official TypeScript client for building server-side Inttegro integrations.

> **Fastest, most modern path:** connect an agent to [Inttegro MCP](https://studio.inttegro.com/inttegro-mcp) at `https://mcp.inttegro.com`, then ask it to run `design_integration`. It will produce an implementation and test plan for your application. Use this SDK when you are ready to connect that plan to your TypeScript runtime.

All official Inttegro SDKs expose the same API capabilities. This package adds TypeScript-specific types, tooling, and runtime controls.

## Install

Requires Node.js 24 or newer.

```bash
npm install @inttegro/inttegro-sdk
```

Store your secret key in the server environment:

```bash
export INTTEGRO_API_KEY="your_secret_key"
```

Never put the key in browser code, a mobile app, or source control. The client uses `https://api.inttegro.com` by default.

## Create a hosted checkout

Create and finalize an order, then send the customer to its hosted invoice URL:

```ts
import { InttegroClient, InttegroAPIError, ProductTypes } from '@inttegro/inttegro-sdk';

const inttegro = new InttegroClient({
  apiKey: process.env.INTTEGRO_API_KEY!,
});

try {
  const order = await inttegro.orders.create({
    request_meta: { idempotency_key: 'checkout-cart-123' },
    customer_data: {
      name: 'Akua Mensah',
      email_address: 'akua@example.com',
      phone_number: '+233544998605',
    },
    finalize: true,
    checkout_settings: {
      redirect_url: 'https://example.com/orders/complete',
      cancel_url: 'https://example.com/cart',
    },
    line_items: [
      {
        type: 'product',
        product: {
          type: ProductTypes.Digital,
          name: 'Monthly subscription',
          quantity: 1,
          price: { currency: 'ghs', value: 5000 },
        },
      },
    ],
  });

  const checkoutUrl = order.invoice?.format?.web?.url;
  if (!checkoutUrl) throw new Error('Order did not include a checkout URL');
  console.log(order.id, checkoutUrl);
} catch (error) {
  if (error instanceof InttegroAPIError) {
    console.error(error.code, error.detail ?? error.message);
  }
  throw error;
}
```

Amounts use integer minor units: `5000` GHS is GHS 50.00. Reuse the same idempotency key when retrying the same logical write. If you omit one, the SDK generates a UUIDv7 key for mutating calls.

## Work with the API

The SDK covers orders and checkout, customers, products and prices, purchase intents, payment methods, balances, payouts and refunds, notifications, files, application settings, keys, and country specifications. Resources use camel-case properties such as `purchaseIntents` and `paymentMethods`.

TypeScript-specific features:

- Typed request and domain objects, plus exported constants for public enum values.
- Promise-based resource methods with ESM and CommonJS builds.
- No runtime dependencies; the client uses the platform `fetch` implementation.
- Configurable timeouts, exponential retries, debug logging, and request/response interceptors.
- Injectable configuration and interceptors for tests and observability.

See the [API reference](https://studio.inttegro.com/api-reference) for request fields and lifecycle rules, [errors](https://studio.inttegro.com/errors) for recovery guidance, and [idempotency](https://studio.inttegro.com/idempotency) for safe retries.

## Verify a release

The GitHub release for each version is the canonical record. It contains the exact npm tarball, its file list, SHA-256 checksums, and a Sigstore attestation tied to the source commit and release workflow. The npm package also includes the TypeScript source and source maps.

```bash
sha256sum --check SHA256SUMS
gh attestation verify inttegro-inttegro-sdk-3.0.0.tgz \
  --repo zebodotdev/inttegro-sdk-typescript
```

## Develop

```bash
npm ci
npm run typecheck
npm test
```
