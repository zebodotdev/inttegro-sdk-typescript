import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Products } from '../resources/products';
import { HttpClient } from '../http-client';

describe('Products', () => {
  let products: Products;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    products = new Products(httpClient);
  });

  it('should create a product', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ product: { id: 'prod_123' } });

    const result = await products.create({
      type: 'physical',
      name: 'T-Shirt',
    });

    expect(result).toEqual({ product: { id: 'prod_123' } });
    expect(postSpy).toHaveBeenCalledWith('/products/create', expect.any(Object));
  });

  it('should lookup/update and manage product state', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ product: { id: 'prod_123' } });

    await products.lookup({ product_id: 'prod_123' });
    await products.update({ product_id: 'prod_123', name: 'New Name' });
    await products.publish({ product_id: 'prod_123' });
    await products.unpublish({ product_id: 'prod_123' });
    await products.archive({ product_id: 'prod_123' });
    await products.addPrice({
      product_id: 'prod_123',
      amount: { currency: 'ghs', value: 5000 },
      set_as_default: true,
    });
    await products.setDefaultUnitPrice({ product_id: 'prod_123', price_id: 'pr_123' });
    await products.page({ page_number: 1, page_size: 20 });

    expect(postSpy).toHaveBeenCalledWith('/products/lookup', { product_id: 'prod_123' });
    expect(postSpy).toHaveBeenCalledWith('/products/update', { product_id: 'prod_123', name: 'New Name' });
    expect(postSpy).toHaveBeenCalledWith('/products/publish', { product_id: 'prod_123' });
    expect(postSpy).toHaveBeenCalledWith('/products/unpublish', { product_id: 'prod_123' });
    expect(postSpy).toHaveBeenCalledWith('/products/archive', { product_id: 'prod_123' });
    expect(postSpy).toHaveBeenCalledWith('/products/add_price', {
      product_id: 'prod_123',
      amount: { currency: 'ghs', value: 5000 },
      set_as_default: true,
    });
    expect(postSpy).toHaveBeenCalledWith('/products/set_default_unit_price', {
      product_id: 'prod_123',
      price_id: 'pr_123',
    });
    expect(postSpy).toHaveBeenCalledWith('/products/page', { page_number: 1, page_size: 20 });
  });
});
