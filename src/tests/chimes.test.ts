import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Chimes } from '../resources/chimes';
import { HttpClient } from '../http-client';
import { mockChimeResponse, mockScheduleResponse } from './mocks';

describe('Chimes', () => {
  let chimes: Chimes;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    chimes = new Chimes(httpClient);
  });

  it('should send a chime', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockChimeResponse);

    const result = await chimes.send({
      recipient: { type: 'phone', phone: { number: '+233544998605' } },
      full_message: 'Hello',
    });

    expect(result).toEqual(mockChimeResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/send', expect.any(Object));
  });

  it('should send an email chime without full_message', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockChimeResponse);

    const request = {
      recipient: { type: 'email' as const, email: { address: 'customer@example.com' } },
      email: {
        subject: 'Receipt ready',
        text: 'Your receipt is ready.',
        from: { address: 'notifications@example.com' },
      },
    };

    const result = await chimes.send(request);

    expect(result).toEqual(mockChimeResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/send', request);
  });

  it('should reject mixed SMS and email content on send', async () => {
    await expect(
      chimes.send({
        recipient: { type: 'email', email: { address: 'customer@example.com' } },
        full_message: 'Hello',
        email: {
          subject: 'Receipt ready',
          text: 'Your receipt is ready.',
          from: { address: 'notifications@example.com' },
        },
      } as any)
    ).rejects.toThrow('full_message and email cannot be provided together');
  });

  it('should validate missing fields on send', async () => {
    await expect(chimes.send({} as any)).rejects.toThrow('Validation failed');
  });

  it('should lookup a chime', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockChimeResponse);

    const result = await chimes.lookup({ chime_id: 'ch_123' });

    expect(result).toEqual(mockChimeResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/lookup', { chime_id: 'ch_123' });
  });

  it('should page chimes', async () => {
    const mockResponse = { page: { number: 1, size: 20, chimes: [] } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await chimes.page({ page_number: 1, page_size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/page', {
      page_number: 1,
      page_size: 20,
    });
  });

  it('should broadcast a chime', async () => {
    const mockResponse = { broadcast: { id: 'brc_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const request = {
      recipients: [{ transport: 'sms' as const, phone: { number: '+233544998605' } }],
      sender: 'YourBrand',
      message_template: 'Hello',
    };

    const result = await chimes.broadcast(request);

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/broadcast', request);
  });

  it('should validate missing fields on broadcast', async () => {
    await expect(chimes.broadcast({ recipients: [], sender: '' } as any)).rejects.toThrow(
      'Validation failed'
    );
  });

  it('should schedule a chime', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockScheduleResponse);

    const result = await chimes.schedule({
      recipients: ['+233544998605'],
      full_message: 'Hello',
      send_after: '2026-01-18T10:00:00Z',
    });

    expect(result).toEqual(mockScheduleResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/schedule', expect.any(Object));
  });

  it('should schedule an email chime without full_message', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockScheduleResponse);

    const request = {
      recipients: ['customer@example.com'],
      email: {
        subject: 'Reminder',
        text: 'Your appointment is tomorrow.',
        from: { address: 'notifications@example.com' },
      },
      send_after: '2026-01-18T10:00:00Z',
    };

    const result = await chimes.schedule(request);

    expect(result).toEqual(mockScheduleResponse);
    expect(postSpy).toHaveBeenCalledWith('/chimes/schedule', request);
  });

  it('should reject mixed SMS and email content on schedule', async () => {
    await expect(
      chimes.schedule({
        recipients: ['customer@example.com'],
        full_message: 'Hello',
        email: {
          subject: 'Reminder',
          text: 'Your appointment is tomorrow.',
          from: { address: 'notifications@example.com' },
        },
        send_after: '2026-01-18T10:00:00Z',
      } as any)
    ).rejects.toThrow('full_message and email cannot be provided together');
  });

  it('should validate missing fields on schedule', async () => {
    await expect(chimes.schedule({} as any)).rejects.toThrow('Validation failed');
  });
});
