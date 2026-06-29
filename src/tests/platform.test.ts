import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Platform } from '../resources/platform';
import { HttpClient } from '../http-client';

describe('Platform', () => {
  let platform: Platform;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    platform = new Platform(httpClient);
  });

  it('should create app / generate key / new session', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({ ok: true } as any);

    await platform.createApp({ name: 'app' });
    await platform.generateKey({ app_id: 'app' });
    await platform.newSession({ app_id: 'app' });

    expect(postSpy).toHaveBeenCalledWith('/apps/create', { name: 'app' });
    expect(postSpy).toHaveBeenCalledWith('/keys/generate', { app_id: 'app' });
    expect(postSpy).toHaveBeenCalledWith('/sessions/new', { app_id: 'app' });
  });
});
