import { HttpClient } from '../http-client';
import {
  ChimeResponse,
  LookupChimeRequest,
  SendChimeRequest,
  ScheduleChimeRequest,
  ScheduleChimeResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

/**
 * Chimes resource for sending and looking up chimes
 */
export class Chimes {
  constructor(private httpClient: HttpClient) {}

  async send(request: SendChimeRequest): Promise<ChimeResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['recipient']);
    errors.push(...validateExclusiveChimeContent(request, 'full_message'));
    throwIfValidationErrors(errors);

    return this.httpClient.post<ChimeResponse>('/chimes/send', request);
  }

  async lookup(request: LookupChimeRequest): Promise<ChimeResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['chime_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ChimeResponse>('/chimes/lookup', request);
  }

  async schedule(request: ScheduleChimeRequest): Promise<ScheduleChimeResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['send_after']);
    if (!request.recipients || request.recipients.length === 0) {
      errors.push({ field: 'recipients', message: 'recipients is required' });
    }
    errors.push(...validateExclusiveChimeContent(request, 'full_message'));
    throwIfValidationErrors(errors);

    return this.httpClient.post<ScheduleChimeResponse>('/chimes/schedule', request);
  }
}

function validateExclusiveChimeContent(
  request: { full_message?: string; email?: unknown },
  smsField: 'full_message'
): ValidationError[] {
  const smsContent = request[smsField];
  const hasSMSContent = typeof smsContent === 'string' && smsContent.trim().length > 0;
  const hasEmailContent = request.email !== undefined && request.email !== null;

  if (hasSMSContent && hasEmailContent) {
    return [
      {
        field: 'content',
        message: `${smsField} and email cannot be provided together`,
      },
    ];
  }

  if (!hasSMSContent && !hasEmailContent) {
    return [
      {
        field: 'content',
        message: `Provide either ${smsField} for SMS or email for email delivery`,
      },
    ];
  }

  return [];
}
