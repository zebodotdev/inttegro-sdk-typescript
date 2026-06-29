import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Balances } from '../resources/balances';
import { HttpClient } from '../http-client';
import { BalancesResponse } from '../types';

describe('Balances', () => {
  let balances: Balances;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    balances = new Balances(httpClient);
  });

  it('should fetch balances', async () => {
    const mockResponse: BalancesResponse = {
      balances: {
        ghs: {
          available: { amount: 1000 },
          pending: { amount: 200 },
          includes_transactions_before: '2024-01-01T00:00:00Z',
        },
      },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balances.get();

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/balances', {});
  });
});
