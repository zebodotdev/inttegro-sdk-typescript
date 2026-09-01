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
    const mockResponse = { price: { id: 'pr_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await prices.page({ product_id: 'prod_123', page_number: 1, page_size: 20 });
    await prices.activate({ price_id: 'pr_123' });
    const result = await prices.deactivate({ price_id: 'pr_123' });
    await prices.archive({ price_id: 'pr_123' }, { idempotencyKey: 'idem_price_archive' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/prices/page', {
      product_id: 'prod_123',
      page_number: 1,
      page_size: 20,
    });
    expect(postSpy).toHaveBeenCalledWith('/prices/activate', { price_id: 'pr_123' });
    expect(postSpy).toHaveBeenCalledWith('/prices/deactivate', { price_id: 'pr_123' });
    expect(postSpy).toHaveBeenCalledWith(
      '/prices/archive',
      { price_id: 'pr_123' },
      { headers: { 'Idempotency-Key': 'idem_price_archive' } }
    );
  });

  it('should validate price_id for activate', async () => {
    await expect(prices.activate({} as any)).rejects.toThrow('Validation failed');
  });
});
