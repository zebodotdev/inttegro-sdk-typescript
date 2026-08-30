import { HttpClient } from '../http-client';
import {
  CancelPurchaseIntentRequest,
  CreatePurchaseIntentRequest,
  LookupPurchaseIntentRequest,
  PagePurchaseIntentsRequest,
  PagePurchaseIntentsResponse,
  PurchaseIntentResponse,
  UpdatePurchaseIntentRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

export class PurchaseIntents {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreatePurchaseIntentRequest): Promise<PurchaseIntentResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['quantity']);
    errors.push(...validatePurchaseIntentProductSelection(request));
    errors.push(...validatePurchaseIntentPriceSelection(request));
    throwIfValidationErrors(errors);

    return this.httpClient.post<PurchaseIntentResponse>('/purchase_intents/create', request);
  }

  async update(request: UpdatePurchaseIntentRequest): Promise<PurchaseIntentResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PurchaseIntentResponse>('/purchase_intents/update', request);
  }

  async cancel(request: CancelPurchaseIntentRequest): Promise<PurchaseIntentResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PurchaseIntentResponse>('/purchase_intents/cancel', request);
  }

  async lookup(request: LookupPurchaseIntentRequest): Promise<PurchaseIntentResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PurchaseIntentResponse>('/purchase_intents/lookup', request);
  }

  async page(request: PagePurchaseIntentsRequest): Promise<PagePurchaseIntentsResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'page_number',
      'page_size',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PagePurchaseIntentsResponse>('/purchase_intents/page', request);
  }
}

function validatePurchaseIntentProductSelection(
  request: CreatePurchaseIntentRequest
): ValidationError[] {
  if ('product' in request && request.product) return [];
  if ('product_id' in request && request.product_id) return [];

  return [
    {
      field: 'product/product_id',
      message: 'Either product or product_id must be provided',
    },
  ];
}

function validatePurchaseIntentPriceSelection(
  request: CreatePurchaseIntentRequest
): ValidationError[] {
  if ('price' in request && request.price) return [];
  if ('price_id' in request && request.price_id) return [];

  return [
    {
      field: 'price/price_id',
      message: 'Either price or price_id must be provided',
    },
  ];
}
