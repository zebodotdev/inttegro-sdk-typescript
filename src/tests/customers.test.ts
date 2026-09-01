import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customers } from '../resources/customers';
import { HttpClient } from '../http-client';

describe('Customers', () => {
  let customers: Customers;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    customers = new Customers(httpClient);
  });

  it('should create a customer', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ customer: { id: 'cu_123' } });

    const result = await customers.create({ name: 'Jane Doe' });

    expect(result).toEqual({ customer: { id: 'cu_123' } });
    expect(postSpy).toHaveBeenCalledWith('/customers/create', { name: 'Jane Doe' });
  });

  it('should lookup a customer', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ customer: { id: 'cu_123' } });

    const result = await customers.lookup({ customer_id: 'cu_123' });

    expect(result).toEqual({ customer: { id: 'cu_123' } });
    expect(postSpy).toHaveBeenCalledWith('/customers/lookup', { customer_id: 'cu_123' });
  });

  it('should page customers', async () => {
    const postSpy = vi
      .spyOn(httpClient, 'post')
      .mockResolvedValue({ page: { number: 1, size: 1 } });

    const result = await customers.page({ page_number: 1, page_size: 50 });

    expect(result).toEqual({ page: { number: 1, size: 1 } });
    expect(postSpy).toHaveBeenCalledWith('/customers/page', { page_number: 1, page_size: 50 });
  });

  it('should update a customer with an idempotency key', async () => {
    const response = { customer: { id: 'cu_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(response);

    const result = await customers.update(
      { customer_id: 'cu_123', name: 'Jane Updated' },
      { idempotencyKey: 'idem_customer_update' }
    );

    expect(result).toEqual(response);
    expect(postSpy).toHaveBeenCalledWith(
      '/customers/update',
      { customer_id: 'cu_123', name: 'Jane Updated' },
      { headers: { 'Idempotency-Key': 'idem_customer_update' } }
    );
  });
});
