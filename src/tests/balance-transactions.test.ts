import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BalanceTransactions } from '../resources/balance-transactions';
import { HttpClient } from '../http-client';

describe('BalanceTransactions', () => {
  let balanceTransactions: BalanceTransactions;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    balanceTransactions = new BalanceTransactions(httpClient);
  });

  it('should lookup a balance transaction', async () => {
    const mockResponse = { transaction: { id: 'bt_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balanceTransactions.lookup({ transaction_id: 'bt_123' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/balance_transactions/lookup', {
      transaction_id: 'bt_123',
    });
  });

  it('should page balance transactions', async () => {
    const mockResponse = { page: { number: 1, size: 20, transactions: [] } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balanceTransactions.page({ page_number: 1, page_size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/balance_transactions/page', {
      page_number: 1,
      page_size: 20,
    });
  });

  it('should validate transaction_id for lookup', async () => {
    await expect(balanceTransactions.lookup({} as any)).rejects.toThrow('Validation failed');
  });
});
