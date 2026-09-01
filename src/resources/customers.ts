import { HttpClient } from '../http-client';
import {
  CreateCustomerRequest,
  CustomerResponse,
  LookupCustomerRequest,
  PageCustomersRequest,
  PageCustomersResponse,
  RequestOptions,
  UpdateCustomerRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Customers resource for creating and managing customer records
 */
export class Customers {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['name']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CustomerResponse>('/customers/create', request);
  }

  async lookup(request: LookupCustomerRequest): Promise<CustomerResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['customer_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CustomerResponse>('/customers/lookup', request);
  }

  async update(
    request: UpdateCustomerRequest,
    options: RequestOptions = {}
  ): Promise<CustomerResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['customer_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CustomerResponse>('/customers/update', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async page(request: PageCustomersRequest = {}): Promise<PageCustomersResponse> {
    return this.httpClient.post<PageCustomersResponse>('/customers/page', request);
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
