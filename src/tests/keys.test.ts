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
    const mockResponse = { key: { id: 'sk_123', token_type: 'bearer' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await keys.generate({ label: 'Production checkout' });
    const result = await keys.page({ number: 1, size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/keys/generate', { label: 'Production checkout' });
    expect(postSpy).toHaveBeenCalledWith('/keys/page', { number: 1, size: 20 });
  });

  it('should lookup, update, destroy, and fetch usage for secret keys', async () => {
    const mockResponse = { key: { id: 'sk_123', token_type: 'bearer' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    await keys.lookup({ secret_key_id: 'sk_123' });
    await keys.update({ secret_key_id: 'sk_123', label: '' });
    await keys.destroy({ secret_key_id: 'sk_123' });
    const result = await keys.usage({ secret_key_id: 'sk_123', number: 1, size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/keys/lookup', { secret_key_id: 'sk_123' });
    expect(postSpy).toHaveBeenCalledWith('/keys/update', {
      secret_key_id: 'sk_123',
      label: '',
    });
    expect(postSpy).toHaveBeenCalledWith('/keys/destroy', { secret_key_id: 'sk_123' });
    expect(postSpy).toHaveBeenCalledWith('/keys/usage', {
      secret_key_id: 'sk_123',
      number: 1,
      size: 20,
    });
  });

  it('should validate secret key identifiers', async () => {
    // @ts-expect-error Exercise runtime validation for untyped JavaScript callers.
    await expect(keys.lookup({})).rejects.toThrow('Validation failed');
  });
});
