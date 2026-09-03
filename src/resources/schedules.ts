import { HttpClient } from '../http-client';
import { LookupScheduleRequest, CancelScheduleRequest, ScheduledChime } from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Schedules resource for looking up or canceling scheduled chimes
 */
export class Schedules {
  constructor(private httpClient: HttpClient) {}

  async lookup(request: LookupScheduleRequest): Promise<ScheduledChime> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['schedule_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<ScheduledChime>(
      '/schedules/lookup',
      'scheduled_chime',
      request
    );
  }

  async cancel(request: CancelScheduleRequest): Promise<ScheduledChime> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['schedule_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<ScheduledChime>(
      '/schedules/cancel',
      'scheduled_chime',
      request
    );
  }
}
