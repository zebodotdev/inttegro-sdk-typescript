/**
 * Inttegro SDK for TypeScript/JavaScript
 *
 * @packageDocumentation
 */

// Main client
export { InttegroClient } from './client';

// Configuration
export type {
  InttegroConfig,
  RetryConfig,
  RequestInterceptor,
  ResponseInterceptor,
} from './config';

// Error classes
export {
  InttegroAPIError,
  InttegroValidationError,
  InttegroNetworkError,
  InttegroAuthenticationError,
  InttegroRateLimitError,
} from './errors';
export type { APIErrorDocument } from './errors';

// Types
export * from './types';
export * as money from './types/money';
export * as payments from './types/payments';
export * as chimes from './types/chimes';

// Utilities
export { generateIdempotencyKey } from './utils/idempotency';
