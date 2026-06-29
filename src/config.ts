/**
 * Configuration options for the Commerce SDK
 */

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum retry delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
  url: string,
  options: RequestInit
) => Promise<{ url: string; options: RequestInit }> | { url: string; options: RequestInit };

/**
 * Response interceptor function
 */
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

/**
 * SDK Configuration
 */
export interface CommerceConfig {
  /** API key for authentication (required) */
  apiKey: string;
  /** Base URL for the API (default: https://api.zebo.dev) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Retry configuration */
  retry?: RetryConfig;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Request interceptors */
  requestInterceptors?: RequestInterceptor[];
  /** Response interceptors */
  responseInterceptors?: ResponseInterceptor[];
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Required<Omit<CommerceConfig, 'apiKey'>> = {
  baseUrl: 'https://api.zebo.dev',
  timeout: 30000,
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  debug: false,
  requestInterceptors: [],
  responseInterceptors: [],
};

