import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http-client';

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('HttpClient idempotency', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adds request_meta.idempotency_key to mutating JSON POST bodies', async () => {
    const calls: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, options: RequestInit) => {
        calls.push(options);
        return jsonResponse({ ok: true });
      })
    );

    const client = new HttpClient({ apiKey: 'sk_test', baseUrl: 'https://api.zebo.dev' });
    await client.post('/orders/new', { number: 'ORDER-1', idempotency_key: 'legacy' });

    const body = JSON.parse(calls[0].body as string);
    expect(body.idempotency_key).toBeUndefined();
    expect(body.request_meta.idempotency_key).toMatch(UUID_V7_REGEX);
  });

  it('does not add idempotency metadata to read-style POST bodies', async () => {
    const calls: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, options: RequestInit) => {
        calls.push(options);
        return jsonResponse({ ok: true });
      })
    );

    const client = new HttpClient({ apiKey: 'sk_test', baseUrl: 'https://api.zebo.dev' });
    await client.post('/orders/lookup', { order_id: 'or_123', idempotency_key: 'legacy' });

    const body = JSON.parse(calls[0].body as string);
    expect(body.idempotency_key).toBeUndefined();
    expect(body.request_meta).toBeUndefined();
  });

  it('adds an Idempotency-Key header to mutating multipart requests', async () => {
    const calls: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, options: RequestInit) => {
        calls.push(options);
        return jsonResponse({ ok: true });
      })
    );

    const client = new HttpClient({ apiKey: 'sk_test', baseUrl: 'https://api.zebo.dev' });
    await client.postForm('/files/create', new FormData());

    const headers = calls[0].headers as Record<string, string>;
    expect(headers['Idempotency-Key']).toMatch(UUID_V7_REGEX);
  });
});

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
