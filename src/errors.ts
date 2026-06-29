/**
 * Custom error classes for the Zebo Commerce SDK
 */

/**
 * API error response structure
 */
export interface APIErrorPayload {
  type?: string;
  code?: string;
  url?: string;
  message?: string;
  detail?: string;
  fix_code?: string;
  cause?: string;
}

export interface APIErrorResponse {
  error?: APIErrorPayload;
  message?: string;
  code?: string;
  type?: string;
  url?: string;
  detail?: string;
  fix_code?: string;
  cause?: string;
}

/**
 * Base error class for all Commerce API errors
 */
export class CommerceAPIError extends Error {
  /** HTTP status code */
  public readonly statusCode?: number;
  /** Error code from API */
  public readonly code?: string;
  /** Error type */
  public readonly type?: string;
  /** Error reference URL */
  public readonly url?: string;
  /** Detailed error explanation */
  public readonly detail?: string;
  /** Suggested resolution */
  public readonly fixCode?: string;
  /** Underlying category of failure */
  public readonly cause?: string;
  /** Original error response */
  public readonly response?: APIErrorResponse;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    response?: APIErrorResponse
  ) {
    super(message);
    this.name = 'CommerceAPIError';
    this.statusCode = statusCode;
    this.code = code;
    this.type = type;
    this.url = url;
    this.detail = detail;
    this.fixCode = fixCode;
    this.cause = cause;
    this.response = response;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CommerceAPIError);
    }

    Object.setPrototypeOf(this, CommerceAPIError.prototype);
  }

  /**
   * Create error from API response
   */
  static fromResponse(statusCode: number, response: APIErrorResponse): CommerceAPIError {
    const payload = resolveAPIErrorPayload(response);
    const message =
      payload.message || payload.detail || response.message || 'An unknown error occurred';
    const code = payload.code || response.code;
    const type = payload.type || response.type;
    const url = payload.url || response.url;
    const detail = payload.detail || response.detail;
    const fixCode = payload.fix_code || response.fix_code;
    const cause = payload.cause || response.cause;

    // Return specific error types based on status code
    if (statusCode >= 400 && statusCode < 500) {
      return new CommerceValidationError(
        message,
        statusCode,
        code,
        type,
        url,
        detail,
        fixCode,
        cause,
        response
      );
    }

    return new CommerceAPIError(
      message,
      statusCode,
      code,
      type,
      url,
      detail,
      fixCode,
      cause,
      response
    );
  }
}

/**
 * Validation error for invalid request parameters
 * Typically thrown for 4xx status codes
 */
export class CommerceValidationError extends CommerceAPIError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    response?: APIErrorResponse
  ) {
    super(message, statusCode, code, type, url, detail, fixCode, cause, response);
    this.name = 'CommerceValidationError';
    Object.setPrototypeOf(this, CommerceValidationError.prototype);
  }
}

/**
 * Network error for connection and timeout issues
 */
export class CommerceNetworkError extends Error {
  /** Original error that caused the network failure */
  public readonly cause?: Error;
  /** Whether the error was due to a timeout */
  public readonly isTimeout: boolean;

  constructor(message: string, cause?: Error, isTimeout = false) {
    super(message);
    this.name = 'CommerceNetworkError';
    this.cause = cause;
    this.isTimeout = isTimeout;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CommerceNetworkError);
    }

    Object.setPrototypeOf(this, CommerceNetworkError.prototype);
  }
}

/**
 * Authentication error for invalid credentials
 */
export class CommerceAuthenticationError extends CommerceAPIError {
  constructor(
    message: string,
    statusCode = 401,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    response?: APIErrorResponse
  ) {
    super(
      message,
      statusCode,
      code,
      type || 'authentication_error',
      url,
      detail,
      fixCode,
      cause,
      response
    );
    this.name = 'CommerceAuthenticationError';
    Object.setPrototypeOf(this, CommerceAuthenticationError.prototype);
  }
}

/**
 * Rate limit error
 */
export class CommerceRateLimitError extends CommerceAPIError {
  /** When the rate limit resets (timestamp) */
  public readonly retryAfter?: number;

  constructor(
    message: string,
    statusCode = 429,
    retryAfter?: number,
    code?: string,
    type?: string,
    url?: string,
    detail?: string,
    fixCode?: string,
    cause?: string,
    response?: APIErrorResponse
  ) {
    super(
      message,
      statusCode,
      code || 'rate_limit',
      type || 'rate_limit_error',
      url,
      detail,
      fixCode,
      cause,
      response
    );
    this.name = 'CommerceRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, CommerceRateLimitError.prototype);
  }
}

function resolveAPIErrorPayload(response: APIErrorResponse): APIErrorPayload {
  if (response.error) {
    return response.error;
  }
  return {
    type: response.type,
    code: response.code,
    url: response.url,
    message: response.message,
    detail: response.detail,
    fix_code: response.fix_code,
    cause: response.cause,
  };
}
