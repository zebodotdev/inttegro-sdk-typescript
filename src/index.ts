/**
 * Zebo Commerce SDK for TypeScript/JavaScript
 *
 * @packageDocumentation
 */

// Main client
export { CommerceClient } from './client';

// Configuration
export type { CommerceConfig, RetryConfig, RequestInterceptor, ResponseInterceptor } from './config';

// Error classes
export {
  CommerceAPIError,
  CommerceValidationError,
  CommerceNetworkError,
  CommerceAuthenticationError,
  CommerceRateLimitError,
} from './errors';
export type { APIErrorResponse } from './errors';

// Types
export * from './types';

// Utilities
export { generateIdempotencyKey } from './utils/idempotency';
