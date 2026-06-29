import { HttpClient } from '../http-client';
import { CreatePriceRequest, LookupPriceRequest, PriceResponse, UpdatePriceRequest } from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Prices resource for managing catalog prices
 */
export class Prices {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreatePriceRequest): Promise<PriceResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['currency', 'amount']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PriceResponse>('/prices/create', request);
  }

  async lookup(request: LookupPriceRequest): Promise<PriceResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PriceResponse>('/prices/lookup', request);
  }

  async update(request: UpdatePriceRequest): Promise<PriceResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['price_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PriceResponse>('/prices/update', request);
  }
}
