import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { Keys } from '../resources/keys';

describe('Keys', () => {
  let keys: Keys;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    keys = new Keys(httpClient);
  });

  it('should generate and page secret keys', async () => {
    const mockResponse = {
      key: { id: 'sk_123', tokenType: 'bearer' },
      page: { number: 1, size: 20, count: 0, total: 0, hasMore: false, keys: [] },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await keys.generate({ label: 'Production checkout' });
    const result = await keys.page({ number: 1, size: 20 });

    expect(result).toEqual(mockResponse.page);
    expect(postSpy).toHaveBeenCalledWith('/keys/generate', { label: 'Production checkout' });
    expect(postSpy).toHaveBeenCalledWith('/keys/page', { number: 1, size: 20 });
  });

  it('should lookup, update, destroy, and fetch usage for secret keys', async () => {
    const mockResponse = {
      key: { id: 'sk_123', tokenType: 'bearer' },
      usage: { number: 1, size: 20, count: 0, total: 0, hasMore: false, rows: [] },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await keys.lookup({ secretKeyId: 'sk_123' });
    await keys.update({ secretKeyId: 'sk_123', label: '' });
    await keys.destroy({ secretKeyId: 'sk_123' });
    const result = await keys.usage({ secretKeyId: 'sk_123', number: 1, size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/keys/lookup', { secretKeyId: 'sk_123' });
    expect(postSpy).toHaveBeenCalledWith('/keys/update', {
      secretKeyId: 'sk_123',
      label: '',
    });
    expect(postSpy).toHaveBeenCalledWith('/keys/destroy', { secretKeyId: 'sk_123' });
    expect(postSpy).toHaveBeenCalledWith('/keys/usage', {
      secretKeyId: 'sk_123',
      number: 1,
      size: 20,
    });
  });

  it('should validate secret key identifiers', async () => {
    // @ts-expect-error Exercise runtime validation for untyped JavaScript callers.
    await expect(keys.lookup({})).rejects.toThrow('Validation failed');
  });
});
