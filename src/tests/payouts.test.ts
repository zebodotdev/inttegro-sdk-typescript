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

  it('should schedule and lookup payouts', async () => {
    const mockResponse = { payout: { id: 'po_123', status: 'scheduled' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await payouts.schedule({
      destination_id: 'fa_123',
      max_amount: 250000,
      reference: 'PAYOUT-APR-15',
    });
    const result = await payouts.lookup({ payout_id: 'po_123' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/payouts/schedule', {
      destination_id: 'fa_123',
      max_amount: 250000,
      reference: 'PAYOUT-APR-15',
    });
    expect(postSpy).toHaveBeenCalledWith('/payouts/lookup', { payout_id: 'po_123' });
  });

  it('should enable automatic payouts', async () => {
    const mockResponse = { settings: { id: 'payout_settings', automatic: true } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await payouts.enableAutomatic();

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/payouts/enable', {});
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
