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
  if ('productId' in request && request.productId) return [];

  return [
    {
      field: 'product/productId',
      message: 'Either product or productId must be provided',
    },
  ];
}

function validatePurchaseIntentPriceSelection(
  request: CreatePurchaseIntentRequest
): ValidationError[] {
  if ('price' in request && request.price) return [];
  if ('priceId' in request && request.priceId) return [];

  return [
    {
      field: 'price/priceId',
      message: 'Either price or priceId must be provided',
    },
  ];
}
