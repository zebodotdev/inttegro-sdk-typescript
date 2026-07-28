import { HttpClient } from '../http-client';
import {
  LookupBroadcastRequest,
  CancelBroadcastRequest,
  LookupBroadcastResponse,
  BroadcastCancelResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Broadcasts resource for looking up or canceling broadcasts
 */
export class Broadcasts {
  constructor(private httpClient: HttpClient) {}

  async lookup(request: LookupBroadcastRequest): Promise<LookupBroadcastResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'broadcast_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<LookupBroadcastResponse>('/broadcasts/lookup', request);
  }

  async cancel(request: CancelBroadcastRequest): Promise<BroadcastCancelResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'broadcast_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<BroadcastCancelResponse>('/broadcasts/cancel', request);
  }
}
