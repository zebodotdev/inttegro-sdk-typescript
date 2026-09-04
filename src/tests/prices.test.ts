import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { Prices } from '../resources/prices';

describe('Prices', () => {
  let prices: Prices;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    prices = new Prices(httpClient);
  });

  it('should page, activate, deactivate, and archive prices', async () => {
    const mockResponse = { price: { id: 'pr_123' }, page: { number: 1, size: 20, prices: [] } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await prices.page({ productId: 'prod_123', pageNumber: 1, pageSize: 20 });
    await prices.activate({ priceId: 'pr_123' });
    const result = await prices.deactivate({ priceId: 'pr_123' });
    await prices.archive({ priceId: 'pr_123' }, { idempotencyKey: 'idem_price_archive' });

    expect(result).toEqual(mockResponse.price);
    expect(postSpy).toHaveBeenCalledWith('/prices/page', {
      productId: 'prod_123',
      pageNumber: 1,
      pageSize: 20,
    });
    expect(postSpy).toHaveBeenCalledWith('/prices/activate', { priceId: 'pr_123' });
    expect(postSpy).toHaveBeenCalledWith('/prices/deactivate', { priceId: 'pr_123' });
    expect(postSpy).toHaveBeenCalledWith(
      '/prices/archive',
      { priceId: 'pr_123' },
      { headers: { 'Idempotency-Key': 'idem_price_archive' } }
    );
  });

  it('should validate price_id for activate', async () => {
    await expect(prices.activate({} as any)).rejects.toThrow('Validation failed');
  });
});
