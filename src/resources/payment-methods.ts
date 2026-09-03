import { HttpClient } from '../http-client';
import {
  ConfirmPaymentMethodVerificationRequest,
  DeletePaymentMethodRequest,
  LookupPaymentMethodRequest,
  PagePaymentMethodsRequest,
  PaymentMethod,
  PaymentMethodActionRequest,
  PaymentMethodDeletion,
  PaymentMethodPage,
  PaymentMethodSettings,
  PaymentMethodVerificationSession,
  TokenizePaymentMethodRequest,
  UpdatePaymentMethodRequest,
  VerifyPaymentMethodRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class PaymentMethods {
  constructor(private httpClient: HttpClient) {}

  async tokenize(request: TokenizePaymentMethodRequest): Promise<PaymentMethod> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'customer_id',
      'type',
      'mobile_money',
      'owner',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethod>(
      '/payment_methods/tokenize',
      'payment_method',
      request
    );
  }

  async verify(request: VerifyPaymentMethodRequest): Promise<PaymentMethodVerificationSession> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethodVerificationSession>(
      '/payment_methods/verify',
      'verification',
      request
    );
  }

  async confirmVerification(
    request: ConfirmPaymentMethodVerificationRequest
  ): Promise<PaymentMethod> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
      'token',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethod>(
      '/payment_methods/confirm_verification',
      'payment_method',
      request
    );
  }

  async lookup(request: LookupPaymentMethodRequest): Promise<PaymentMethod> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethod>(
      '/payment_methods/lookup',
      'payment_method',
      request
    );
  }

  async page(request: PagePaymentMethodsRequest = {}): Promise<PaymentMethodPage> {
    return this.httpClient.postResource<PaymentMethodPage>(
      '/payment_methods/page',
      'page',
      request
    );
  }

  async update(request: UpdatePaymentMethodRequest): Promise<PaymentMethod> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethod>(
      '/payment_methods/update',
      'payment_method',
      request
    );
  }

  async activate(request: PaymentMethodActionRequest): Promise<PaymentMethod> {
    return this.postAction('/payment_methods/activate', request);
  }

  async disactivate(request: PaymentMethodActionRequest): Promise<PaymentMethod> {
    return this.postAction('/payment_methods/disactivate', request);
  }

  async deactivate(request: PaymentMethodActionRequest): Promise<PaymentMethod> {
    return this.disactivate(request);
  }

  async archive(request: PaymentMethodActionRequest): Promise<PaymentMethod> {
    return this.postAction('/payment_methods/archive', request);
  }

  async unarchive(request: PaymentMethodActionRequest): Promise<PaymentMethod> {
    return this.postAction('/payment_methods/unarchive', request);
  }

  async delete(request: DeletePaymentMethodRequest): Promise<PaymentMethodDeletion> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<PaymentMethodDeletion>('/payment_methods/delete', request);
  }

  async settings(): Promise<PaymentMethodSettings> {
    return this.httpClient.postResource<PaymentMethodSettings>(
      '/payment_methods/settings',
      'settings',
      {}
    );
  }

  private async postAction(
    path: string,
    request: PaymentMethodActionRequest
  ): Promise<PaymentMethod> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'payment_method_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<PaymentMethod>(path, 'payment_method', request);
  }
}
