import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Payouts } from '../resources/payouts';
import { HttpClient } from '../http-client';

describe('Payouts', () => {
  let payouts: Payouts;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    payouts = new Payouts(httpClient);
  });

  it('should page payouts', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ page: { payouts: [] } });

    const result = await payouts.page({ page_number: 1, page_size: 20 });

    expect(result).toEqual({ page: { payouts: [] } });
    expect(postSpy).toHaveBeenCalledWith('/payouts/page', { page_number: 1, page_size: 20 });
  });

  it('should cancel scheduled payout', async () => {
    const mockResponse = { payout: { id: 'po_123', status: 'canceled' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await payouts.cancel({ payout_id: 'po_123' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/payouts/cancel', { payout_id: 'po_123' });
  });

  it('should validate payout_id for cancel', async () => {
    await expect(payouts.cancel({ payout_id: '' })).rejects.toThrow('Validation failed');
  });
});
