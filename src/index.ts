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

// Utilities
export { generateIdempotencyKey } from './utils/idempotency';
