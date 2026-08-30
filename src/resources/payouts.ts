import { HttpClient } from '../http-client';
import {
  CancelPayoutRequest,
  CancelPayoutResponse,
  LookupPayoutRequest,
  PagePayoutsRequest,
  PagePayoutsResponse,
  PayoutResponse,
  PayoutSettingsResponse,
  SchedulePayoutRequest,
  SetPayoutDestinationsRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class Payouts {
  constructor(private httpClient: HttpClient) {}

  async setDestinations(request: SetPayoutDestinationsRequest): Promise<PayoutSettingsResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'destinations',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PayoutSettingsResponse>('/payouts/set_destinations', request);
  }

  async settings(): Promise<PayoutSettingsResponse> {
    return this.httpClient.post<PayoutSettingsResponse>('/payouts/settings', {});
  }

  async disableAutomatic(): Promise<PayoutSettingsResponse> {
    return this.httpClient.post<PayoutSettingsResponse>('/payouts/disable', {});
  }

  async enableAutomatic(): Promise<PayoutSettingsResponse> {
    return this.httpClient.post<PayoutSettingsResponse>('/payouts/enable', {});
  }

  async enableFX(): Promise<PayoutSettingsResponse> {
    return this.httpClient.post<PayoutSettingsResponse>('/payouts/enable_fx', {});
  }

  async disableFX(): Promise<PayoutSettingsResponse> {
    return this.httpClient.post<PayoutSettingsResponse>('/payouts/disable_fx', {});
  }

  async page(request: PagePayoutsRequest = {}): Promise<PagePayoutsResponse> {
    return this.httpClient.post<PagePayoutsResponse>('/payouts/page', request);
  }

  async schedule(request: SchedulePayoutRequest): Promise<PayoutResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'destination_id',
      'max_amount',
      'reference',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PayoutResponse>('/payouts/schedule', request);
  }

  async lookup(request: LookupPayoutRequest): Promise<PayoutResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['payout_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PayoutResponse>('/payouts/lookup', request);
  }

  async cancel(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['payout_id']);
    throwIfValidationErrors(errors);
    return this.httpClient.post<CancelPayoutResponse>('/payouts/cancel', request);
  }
}
