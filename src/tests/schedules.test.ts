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

    const result = await schedules.lookup({ schedule_id: 'sch_123' });

    expect(result).toEqual(mockScheduleLookupResponse);
    expect(postSpy).toHaveBeenCalledWith('/schedules/lookup', { schedule_id: 'sch_123' });
  });

  it('should cancel a schedule', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockScheduleLookupResponse);

    const result = await schedules.cancel({ schedule_id: 'sch_123' });

    expect(result).toEqual(mockScheduleLookupResponse);
    expect(postSpy).toHaveBeenCalledWith('/schedules/cancel', { schedule_id: 'sch_123' });
  });

  it('should validate missing fields', async () => {
    await expect(schedules.lookup({} as any)).rejects.toThrow('Validation failed');
  });
});
