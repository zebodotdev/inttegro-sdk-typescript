import { HttpClient } from '../http-client';
import {
  CreatePriceRequest,
  LookupPriceRequest,
  PagePricesRequest,
  Price,
  PricePage,
  PriceActionRequest,
  RequestOptions,
  UpdatePriceRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Prices resource for managing catalog prices
 */
export class Prices {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreatePriceRequest): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['amount']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/create', 'price', request);
  }

  async lookup(request: LookupPriceRequest): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/lookup', 'price', request);
  }

  async update(request: UpdatePriceRequest): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/update', 'price', request);
  }

  async page(request: PagePricesRequest = {}): Promise<PricePage> {
    return this.httpClient.postResource<PricePage>('/prices/page', 'page', request);
  }

  async activate(request: PriceActionRequest): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/activate', 'price', request);
  }

  async deactivate(request: PriceActionRequest): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/deactivate', 'price', request);
  }

  async archive(request: PriceActionRequest, options: RequestOptions = {}): Promise<Price> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Price>('/prices/archive', 'price', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
