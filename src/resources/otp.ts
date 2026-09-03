import { HttpClient } from '../http-client';
import {
  InitiateOtpRequest,
  OtpTransaction,
  OtpVerification,
  VerifyOtpRequest,
  LookupOtpRequest,
  CancelOtpRequest,
} from '../types';

/**
 * OTP resource for initiating and verifying OTP flows
 */
export class Otp {
  constructor(private httpClient: HttpClient) {}

  async initiate(request: InitiateOtpRequest): Promise<OtpTransaction> {
    return this.httpClient.postResource<OtpTransaction>('/otp/initiate', 'transaction', request);
  }

  async verify(request: VerifyOtpRequest): Promise<OtpVerification> {
    return this.httpClient.post<OtpVerification>('/otp/verify', request);
  }

  async lookup(request: LookupOtpRequest): Promise<OtpTransaction> {
    return this.httpClient.postResource<OtpTransaction>('/otp/lookup', 'transaction', request);
  }

  async cancel(request: CancelOtpRequest): Promise<OtpTransaction> {
    return this.httpClient.postResource<OtpTransaction>('/otp/cancel', 'transaction', request);
  }

  // Backwards-compatible alias for initiate()
  async initialize(request: InitiateOtpRequest): Promise<OtpTransaction> {
    return this.initiate(request);
  }
}
