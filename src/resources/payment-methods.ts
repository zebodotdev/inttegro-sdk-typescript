import { HttpClient } from '../http-client';
import {
  ConfirmPaymentMethodVerificationRequest,
  ConfirmPaymentMethodVerificationResponse,
  DeletePaymentMethodRequest,
  DeletePaymentMethodResponse,
  GetPaymentMethodSettingsResponse,
  LookupPaymentMethodRequest,
  LookupPaymentMethodResponse,
  TokenizePaymentMethodRequest,
  TokenizePaymentMethodResponse,
  VerifyPaymentMethodRequest,
  VerifyPaymentMethodResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class PaymentMethods {
  constructor(private httpClient: HttpClient) {}

  async tokenize(request: TokenizePaymentMethodRequest): Promise<TokenizePaymentMethodResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'customer_id',
      'payment_method_data',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<TokenizePaymentMethodResponse>(
      '/payment_methods/tokenize',
      request
    );
  }

  async verify(request: VerifyPaymentMethodRequest): Promise<VerifyPaymentMethodResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<VerifyPaymentMethodResponse>('/payment_methods/verify', request);
  }

  async confirmVerification(
    request: ConfirmPaymentMethodVerificationRequest
  ): Promise<ConfirmPaymentMethodVerificationResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
      'token',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ConfirmPaymentMethodVerificationResponse>(
      '/payment_methods/confirm_verification',
      request
    );
  }

  async lookup(request: LookupPaymentMethodRequest): Promise<LookupPaymentMethodResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<LookupPaymentMethodResponse>('/payment_methods/lookup', request);
  }

  async delete(request: DeletePaymentMethodRequest): Promise<DeletePaymentMethodResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<DeletePaymentMethodResponse>('/payment_methods/delete', request);
  }

  async settings(): Promise<GetPaymentMethodSettingsResponse> {
    return this.httpClient.post<GetPaymentMethodSettingsResponse>('/payment_methods/settings', {});
  }
}
