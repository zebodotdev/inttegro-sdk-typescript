import { RetryConfig } from '../config';
import { Logger } from './logger';

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay for retry with exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Determine if a status code is retryable
 */
function isRetryableStatusCode(statusCode: number): boolean {
  // Retry on 5xx errors and 429 (rate limit)
  return statusCode === 429 || (statusCode >= 500 && statusCode < 600);
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Required<RetryConfig>,
  logger: Logger,
  isRetryable: (error: unknown) => boolean = () => true
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Check if error is retryable
      if (!isRetryable(error)) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        config.initialDelay,
        config.maxDelay,
        config.backoffMultiplier
      );

      logger.debug(`Retry attempt ${attempt + 1} after ${delay}ms`, error);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Check if an HTTP error is retryable
 */
export function isRetryableHttpError(error: unknown): boolean {
  if (error instanceof Error && 'statusCode' in error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode) {
      return isRetryableStatusCode(statusCode);
    }
  }
  return false;
}
