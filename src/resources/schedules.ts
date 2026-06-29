import { HttpClient } from '../http-client';
import {
  LookupScheduleRequest,
  CancelScheduleRequest,
  ScheduleLookupResponse,
  ScheduleCancelResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Schedules resource for looking up or canceling scheduled chimes
 */
export class Schedules {
  constructor(private httpClient: HttpClient) {}

  async lookup(request: LookupScheduleRequest): Promise<ScheduleLookupResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['schedule_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ScheduleLookupResponse>('/schedules/lookup', request);
  }

  async cancel(request: CancelScheduleRequest): Promise<ScheduleCancelResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['schedule_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ScheduleCancelResponse>('/schedules/cancel', request);
  }
}
