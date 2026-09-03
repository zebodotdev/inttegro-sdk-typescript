import { HttpClient } from '../http-client';
import {
  CancelPurchaseIntentRequest,
  CreatePurchaseIntentRequest,
  LookupPurchaseIntentRequest,
  PagePurchaseIntentsRequest,
  PurchaseIntent,
  PurchaseIntentPage,
  UpdatePurchaseIntentRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

export class PurchaseIntents {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreatePurchaseIntentRequest): Promise<PurchaseIntent> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['quantity']);
    errors.push(...validatePurchaseIntentProductSelection(request));
    errors.push(...validatePurchaseIntentPriceSelection(request));
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PurchaseIntent>(
      '/purchase_intents/create',
      'purchase_intent',
      request
    );
  }

  async update(request: UpdatePurchaseIntentRequest): Promise<PurchaseIntent> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PurchaseIntent>(
      '/purchase_intents/update',
      'purchase_intent',
      request
    );
  }

  async cancel(request: CancelPurchaseIntentRequest): Promise<PurchaseIntent> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PurchaseIntent>(
      '/purchase_intents/cancel',
      'purchase_intent',
      request
    );
  }

  async lookup(request: LookupPurchaseIntentRequest): Promise<PurchaseIntent> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PurchaseIntent>(
      '/purchase_intents/lookup',
      'purchase_intent',
      request
    );
  }

  async page(request: PagePurchaseIntentsRequest): Promise<PurchaseIntentPage> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'page_number',
      'page_size',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PurchaseIntentPage>(
      '/purchase_intents/page',
      'page',
      request
    );
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
