import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Broadcasts } from '../resources/broadcasts';
import { HttpClient } from '../http-client';
import { mockBroadcastResponse } from './mocks';

describe('Broadcasts', () => {
  let broadcasts: Broadcasts;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    broadcasts = new Broadcasts(httpClient);
  });

  it('should lookup a broadcast', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockBroadcastResponse);

    const result = await broadcasts.lookup({ broadcast_id: 'brc_123' });

    expect(result).toEqual(mockBroadcastResponse.broadcast);
    expect(postSpy).toHaveBeenCalledWith('/broadcasts/lookup', { broadcast_id: 'brc_123' });
  });

  it('should cancel a broadcast', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockBroadcastResponse);

    const result = await broadcasts.cancel({ broadcast_id: 'brc_123' });

    expect(result).toEqual(mockBroadcastResponse.broadcast);
    expect(postSpy).toHaveBeenCalledWith('/broadcasts/cancel', { broadcast_id: 'brc_123' });
  });

  it('should validate missing fields', async () => {
    await expect(broadcasts.lookup({} as any)).rejects.toThrow('Validation failed');
  });
});
