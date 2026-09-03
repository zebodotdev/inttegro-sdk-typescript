import { HttpClient } from '../http-client';
import {
  CancelPayoutRequest,
  LookupPayoutRequest,
  PagePayoutsRequest,
  Payout,
  PayoutPage,
  PayoutSettings,
  SchedulePayoutRequest,
  SetPayoutDestinationsRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class Payouts {
  constructor(private httpClient: HttpClient) {}

  async setDestinations(request: SetPayoutDestinationsRequest): Promise<PayoutSettings> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'destinations',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PayoutSettings>(
      '/payouts/set_destinations',
      'settings',
      request
    );
  }

  async settings(): Promise<PayoutSettings> {
    return this.httpClient.postResource<PayoutSettings>('/payouts/settings', 'settings', {});
  }

  async disableAutomatic(): Promise<PayoutSettings> {
    return this.httpClient.postResource<PayoutSettings>('/payouts/disable', 'settings', {});
  }

  async enableAutomatic(): Promise<PayoutSettings> {
    return this.httpClient.postResource<PayoutSettings>('/payouts/enable', 'settings', {});
  }

  async enableFX(): Promise<PayoutSettings> {
    return this.httpClient.postResource<PayoutSettings>('/payouts/enable_fx', 'settings', {});
  }

  async disableFX(): Promise<PayoutSettings> {
    return this.httpClient.postResource<PayoutSettings>('/payouts/disable_fx', 'settings', {});
  }

  async page(request: PagePayoutsRequest = {}): Promise<PayoutPage> {
    return this.httpClient.postResource<PayoutPage>('/payouts/page', 'page', request);
  }

  async schedule(request: SchedulePayoutRequest): Promise<Payout> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'destination_id',
      'max_amount',
      'reference',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Payout>('/payouts/schedule', 'payout', request);
  }

  async lookup(request: LookupPayoutRequest): Promise<Payout> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['payout_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Payout>('/payouts/lookup', 'payout', request);
  }

  async cancel(request: CancelPayoutRequest): Promise<Payout> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['payout_id']);
    throwIfValidationErrors(errors);
    return this.httpClient.postResource<Payout>('/payouts/cancel', 'payout', request);
  }
}
