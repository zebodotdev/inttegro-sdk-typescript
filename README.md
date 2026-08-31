# Inttegro TypeScript SDK

## API enum values

Public enum constants are exported from the package, so request payloads do not
need hand-written wire strings:

```ts
import { ProductTypes, RefundReasons } from '@zebo-commerce/typescript-sdk';

const productType = ProductTypes.Digital;
const refundReason = RefundReasons.RequestedByCustomer;
```
