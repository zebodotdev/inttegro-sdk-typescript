import { HttpClient } from '../http-client';
import { Broadcast, LookupBroadcastRequest, CancelBroadcastRequest } from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Broadcasts resource for looking up or canceling broadcasts
 */
export class Broadcasts {
  constructor(private httpClient: HttpClient) {}

  async lookup(request: LookupBroadcastRequest): Promise<Broadcast> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'broadcast_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Broadcast>('/broadcasts/lookup', 'broadcast', request);
  }

  async cancel(request: CancelBroadcastRequest): Promise<Broadcast> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'broadcast_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Broadcast>('/broadcasts/cancel', 'broadcast', request);
  }
}
