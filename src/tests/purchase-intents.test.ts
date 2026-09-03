import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { PurchaseIntents } from '../resources/purchase-intents';

describe('PurchaseIntents', () => {
  let purchaseIntents: PurchaseIntents;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    purchaseIntents = new PurchaseIntents(httpClient);
  });

  it('should create a purchase intent', async () => {
    const mockResponse = { purchase_intent: { id: 'sale_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const request = {
      product_id: 'prod_123',
      price_id: 'pr_123',
      quantity: { min: 1 },
    };

    const result = await purchaseIntents.create(request);

    expect(result).toEqual(mockResponse.purchase_intent);
    expect(postSpy).toHaveBeenCalledWith('/purchase_intents/create', request);
  });

  it('should update, cancel, lookup, and page purchase intents', async () => {
    const mockResponse = {
      purchase_intent: { id: 'sale_123' },
      page: { number: 1, size: 20, purchase_intents: [] },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await purchaseIntents.update({ id: 'sale_123', quantity: { min: 1, max: 3 } });
    await purchaseIntents.cancel({ id: 'sale_123' });
    await purchaseIntents.lookup({ id: 'sale_123' });
    const result = await purchaseIntents.page({ page_number: 1, page_size: 20 });

    expect(result).toEqual(mockResponse.page);
    expect(postSpy).toHaveBeenCalledWith('/purchase_intents/update', {
      id: 'sale_123',
      quantity: { min: 1, max: 3 },
    });
    expect(postSpy).toHaveBeenCalledWith('/purchase_intents/cancel', { id: 'sale_123' });
    expect(postSpy).toHaveBeenCalledWith('/purchase_intents/lookup', { id: 'sale_123' });
    expect(postSpy).toHaveBeenCalledWith('/purchase_intents/page', {
      page_number: 1,
      page_size: 20,
    });
  });

  it('should validate required selectors on create', async () => {
    await expect(
      purchaseIntents.create({
        quantity: { min: 1, max: 5 },
      } as any)
    ).rejects.toThrow('Validation failed');
  });
});
