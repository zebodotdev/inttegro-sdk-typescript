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

    expect(result).toEqual({ id: 'cu_123' });
    expect(postSpy).toHaveBeenCalledWith('/customers/create', { name: 'Jane Doe' });
  });

  it('should lookup a customer', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ customer: { id: 'cu_123' } });

    const result = await customers.lookup({ customerId: 'cu_123' });

    expect(result).toEqual({ id: 'cu_123' });
    expect(postSpy).toHaveBeenCalledWith('/customers/lookup', { customerId: 'cu_123' });
  });

  it('should page customers', async () => {
    const postSpy = vi
      .spyOn(httpClient, 'post')
      .mockResolvedValue({ page: { number: 1, size: 1 } });

    const result = await customers.page({ pageNumber: 1, pageSize: 50 });

    expect(result).toEqual({ number: 1, size: 1 });
    expect(postSpy).toHaveBeenCalledWith('/customers/page', { pageNumber: 1, pageSize: 50 });
  });

  it('should update a customer with an idempotency key', async () => {
    const response = { customer: { id: 'cu_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(response);

    const result = await customers.update(
      { customerId: 'cu_123', name: 'Jane Updated' },
      { idempotencyKey: 'idem_customer_update' }
    );

    expect(result).toEqual(response.customer);
    expect(postSpy).toHaveBeenCalledWith(
      '/customers/update',
      { customerId: 'cu_123', name: 'Jane Updated' },
      { headers: { 'Idempotency-Key': 'idem_customer_update' } }
    );
  });
});
