import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { PaymentMethods } from '../resources/payment-methods';

describe('PaymentMethods', () => {
  let paymentMethods: PaymentMethods;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    paymentMethods = new PaymentMethods(httpClient);
  });

  it('should page and update payment methods', async () => {
    const mockResponse = { payment_method: { id: 'pm_123', customer_id: 'cu_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await paymentMethods.page({ customer_id: 'cu_123', page_number: 1, page_size: 20 });
    const result = await paymentMethods.update({
      payment_method_id: 'pm_123',
      custom_data: { segment: 'vip', internal_note: null },
    });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/page', {
      customer_id: 'cu_123',
      page_number: 1,
      page_size: 20,
    });
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/update', {
      payment_method_id: 'pm_123',
      custom_data: { segment: 'vip', internal_note: null },
    });
  });

  it('should activate, disactivate, archive, and unarchive payment methods', async () => {
    const mockResponse = { payment_method: { id: 'pm_123', customer_id: 'cu_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await paymentMethods.activate({ payment_method_id: 'pm_123' });
    await paymentMethods.disactivate({ payment_method_id: 'pm_123' });
    await paymentMethods.archive({ payment_method_id: 'pm_123' });
    const result = await paymentMethods.unarchive({ payment_method_id: 'pm_123' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/activate', {
      payment_method_id: 'pm_123',
    });
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/disactivate', {
      payment_method_id: 'pm_123',
    });
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/archive', {
      payment_method_id: 'pm_123',
    });
    expect(postSpy).toHaveBeenCalledWith('/payment_methods/unarchive', {
      payment_method_id: 'pm_123',
    });
  });

  it('should validate payment_method_id for update', async () => {
    await expect(paymentMethods.update({} as any)).rejects.toThrow('Validation failed');
  });
});
