/**
 * HTTP client for making API requests
 */

import {
  CommerceConfig,
  DEFAULT_CONFIG,
  RequestInterceptor,
  ResponseInterceptor,
  RetryConfig,
} from './config';
import {
  CommerceAPIError,
  CommerceAuthenticationError,
  CommerceNetworkError,
  CommerceRateLimitError,
  APIErrorResponse,
} from './errors';
import { Logger } from './utils/logger';
import { withRetry, isRetryableHttpError } from './utils/retry';
import { generateIdempotencyKey } from './utils/idempotency';

/**
 * HTTP client for making requests to the Zebo Commerce API
 */
export class HttpClient {
  private config: Required<CommerceConfig>;
  private logger: Logger;

  constructor(config: CommerceConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      retry: {
        ...DEFAULT_CONFIG.retry,
        ...config.retry,
      },
    };
    this.logger = new Logger(this.config.debug);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CommerceConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      retry: {
        ...this.config.retry,
        ...config.retry,
      },
    };
    this.logger.setEnabled(this.config.debug);
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.config.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.config.responseInterceptors.push(interceptor);
  }

  /**
   * Make a request with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new CommerceNetworkError(
          `Request timeout after ${this.config.timeout}ms`,
          error,
          true
        );
      }

      throw new CommerceNetworkError(
        'Network request failed',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    url: string,
    options: RequestInit
  ): Promise<{ url: string; options: RequestInit }> {
    let currentUrl = url;
    let currentOptions = options;

    for (const interceptor of this.config.requestInterceptors) {
      const result = await interceptor(currentUrl, currentOptions);
      currentUrl = result.url;
      currentOptions = result.options;
    }

    return { url: currentUrl, options: currentOptions };
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let currentResponse = response;

    for (const interceptor of this.config.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }

    return currentResponse;
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<APIErrorResponse> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as APIErrorResponse;
      }
      return { message: await response.text() };
    } catch {
      return { message: `HTTP ${response.status}: ${response.statusText}` };
    }
  }

  /**
   * Handle error response
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await this.parseErrorResponse(response);
    const payload = errorData.error ?? errorData;

    // Handle authentication errors
    if (response.status === 401) {
      throw new CommerceAuthenticationError(
        payload.message || payload.detail || errorData.message || 'Authentication failed',
        response.status,
        payload.code || errorData.code,
        payload.type,
        payload.url,
        payload.detail,
        payload.fix_code,
        payload.cause,
        errorData
      );
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new CommerceRateLimitError(
        payload.message || payload.detail || errorData.message || 'Rate limit exceeded',
        response.status,
        retryAfter ? parseInt(retryAfter, 10) : undefined,
        payload.code || errorData.code,
        payload.type,
        payload.url,
        payload.detail,
        payload.fix_code,
        payload.cause,
        errorData
      );
    }

    // Handle other errors
    throw CommerceAPIError.fromResponse(response.status, errorData);
  }

  /**
   * Make an API request
   */
  async request<T>(path: string, options: RequestInit = {}, skipRetry = false): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const requestOptionsWithIdempotency = this.withIdempotency(path, options);

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
      'User-Agent': 'zebo-commerce-sdk-typescript/0.1.0',
      ...(requestOptionsWithIdempotency.headers as Record<string, string>),
    };

    // Prepare request options
    let requestOptions: RequestInit = {
      ...requestOptionsWithIdempotency,
      headers,
    };

    // Apply request interceptors
    const interceptedRequest = await this.applyRequestInterceptors(url, requestOptions);
    const finalUrl = interceptedRequest.url;
    requestOptions = interceptedRequest.options;

    this.logger.debug(`Making ${requestOptions.method || 'GET'} request to ${finalUrl}`);

    // Make request with retry logic
    const makeRequest = async (): Promise<T> => {
      const response = await this.fetchWithTimeout(finalUrl, requestOptions);

      // Apply response interceptors
      const interceptedResponse = await this.applyResponseInterceptors(response);

      if (!interceptedResponse.ok) {
        await this.handleErrorResponse(interceptedResponse);
      }

      // Parse successful response
      const contentType = interceptedResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await interceptedResponse.json()) as T;
      }

      // Return empty object for non-JSON responses
      return {} as T;
    };

    // Apply retry logic if not skipped
    if (!skipRetry) {
      return await withRetry(
        makeRequest,
        this.config.retry as Required<RetryConfig>,
        this.logger,
        isRetryableHttpError
      );
    }

    return await makeRequest();
  }

  /**
   * Make a raw request and return the Response for binary or multipart flows.
   */
  async raw(pathOrUrl: string, options: RequestInit = {}, authenticated = true): Promise<Response> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${this.config.baseUrl}${pathOrUrl}`;
    const requestOptionsWithIdempotency = authenticated
      ? this.withIdempotency(pathOrUrl, options, { body: false, header: true })
      : options;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'zebo-commerce-sdk-typescript/0.1.0',
      ...(authenticated ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      ...(requestOptionsWithIdempotency.headers as Record<string, string>),
    };

    let requestOptions: RequestInit = {
      ...requestOptionsWithIdempotency,
      headers,
    };

    const interceptedRequest = await this.applyRequestInterceptors(url, requestOptions);
    const finalUrl = interceptedRequest.url;
    requestOptions = interceptedRequest.options;

    const response = await this.fetchWithTimeout(finalUrl, requestOptions);
    const interceptedResponse = await this.applyResponseInterceptors(response);

    if (!interceptedResponse.ok) {
      await this.handleErrorResponse(interceptedResponse);
    }

    return interceptedResponse;
  }

  /**
   * Make a multipart/form-data POST request.
   */
  async postForm<T>(
    pathOrUrl: string,
    form: FormData,
    options: RequestInit = {},
    authenticated = true
  ): Promise<T> {
    const response = await this.raw(
      pathOrUrl,
      {
        ...options,
        method: 'POST',
        body: form,
      },
      authenticated
    );

    return (await response.json()) as T;
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(path: string, body?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private withIdempotency(
    path: string,
    options: RequestInit,
    mode: { body: boolean; header: boolean } = { body: true, header: false }
  ): RequestInit {
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'POST') {
      return options;
    }

    const headers = normalizeHeaders(options.headers);
    const requestOptions: RequestInit = { ...options, headers };
    if (mode.body && typeof requestOptions.body === 'string') {
      requestOptions.body = stripTopLevelIdempotencyKey(requestOptions.body);
    }
    if (!isIdempotentMutationPath(path)) {
      return requestOptions;
    }

    const existingHeader = findHeader(headers, 'Idempotency-Key');
    if (existingHeader) {
      return requestOptions;
    }

    if (mode.body && typeof requestOptions.body === 'string') {
      const body = addRequestMetaIdempotencyKey(requestOptions.body);
      return { ...requestOptions, body };
    }

    if (mode.header && !existingHeader) {
      headers['Idempotency-Key'] = generateIdempotencyKey();
      return { ...requestOptions, headers };
    }

    return requestOptions;
  }
}

function stripTopLevelIdempotencyKey(body: string): string {
  try {
    const payload = JSON.parse(body) as unknown;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return body;
    }
    const record = payload as Record<string, unknown>;
    delete record.idempotency_key;
    return JSON.stringify(record);
  } catch {
    return body;
  }
}

function addRequestMetaIdempotencyKey(body: string): string {
  try {
    const payload = JSON.parse(body) as unknown;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return body;
    }
    const record = payload as Record<string, unknown>;
    delete record.idempotency_key;
    const requestMeta =
      record.request_meta &&
      typeof record.request_meta === 'object' &&
      !Array.isArray(record.request_meta)
        ? { ...(record.request_meta as Record<string, unknown>) }
        : {};
    if (typeof requestMeta.idempotency_key === 'string' && requestMeta.idempotency_key.trim()) {
      return body;
    }
    return JSON.stringify({
      ...record,
      request_meta: {
        ...requestMeta,
        idempotency_key: generateIdempotencyKey(),
      },
    });
  } catch {
    return body;
  }
}

function normalizeHeaders(headers: RequestInit['headers'] | undefined): Record<string, string> {
  if (!headers) return {};
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return { ...(headers as Record<string, string>) };
}

function findHeader(headers: Record<string, string>, name: string): string | undefined {
  const lowerName = name.toLowerCase();
  const match = Object.entries(headers).find(
    ([key, value]) => key.toLowerCase() === lowerName && value.trim()
  );
  return match?.[1];
}

function isIdempotentMutationPath(pathOrUrl: string): boolean {
  let path = pathOrUrl;
  if (pathOrUrl.startsWith('http')) {
    try {
      path = new URL(pathOrUrl).pathname;
    } catch {
      return false;
    }
  }
  const parts = path.split('/').filter(Boolean);
  const action = parts[parts.length - 1];
  if (!action) return false;
  return !new Set([
    'lookup',
    'page',
    'settings',
    'countries',
    'contents',
    'balances',
    'render_preview',
    'usage',
  ]).has(action);
}
