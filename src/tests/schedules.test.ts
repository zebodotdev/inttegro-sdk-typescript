import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Schedules } from '../resources/schedules';
import { HttpClient } from '../http-client';
import { mockScheduleLookupResponse } from './mocks';

describe('Schedules', () => {
  let schedules: Schedules;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    schedules = new Schedules(httpClient);
  });

  it('should lookup a schedule', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockScheduleLookupResponse);

    const result = await schedules.lookup({ scheduleId: 'sch_123' });

    expect(result).toEqual(mockScheduleLookupResponse.scheduledChime);
    expect(postSpy).toHaveBeenCalledWith('/schedules/lookup', { scheduleId: 'sch_123' });
  });

  it('should cancel a schedule', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockScheduleLookupResponse);

    const result = await schedules.cancel({ scheduleId: 'sch_123' });

    expect(result).toEqual(mockScheduleLookupResponse.scheduledChime);
    expect(postSpy).toHaveBeenCalledWith('/schedules/cancel', { scheduleId: 'sch_123' });
  });

  it('should validate missing fields', async () => {
    await expect(schedules.lookup({} as any)).rejects.toThrow('Validation failed');
  });
});
