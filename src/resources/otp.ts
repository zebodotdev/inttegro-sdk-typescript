import { HttpClient } from '../http-client';
import {
  InitiateOtpRequest,
  InitiateOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LookupOtpRequest,
  LookupOtpResponse,
  CancelOtpRequest,
  CancelOtpResponse,
} from '../types';

/**
 * OTP resource for initiating and verifying OTP flows
 */
export class Otp {
  constructor(private httpClient: HttpClient) {}

  async initiate(request: InitiateOtpRequest): Promise<InitiateOtpResponse> {
    return this.httpClient.post<InitiateOtpResponse>('/otp/initiate', request);
  }

  async verify(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return this.httpClient.post<VerifyOtpResponse>('/otp/verify', request);
  }

  async lookup(request: LookupOtpRequest): Promise<LookupOtpResponse> {
    return this.httpClient.post<LookupOtpResponse>('/otp/lookup', request);
  }

  async cancel(request: CancelOtpRequest): Promise<CancelOtpResponse> {
    return this.httpClient.post<CancelOtpResponse>('/otp/cancel', request);
  }

  // Backwards-compatible alias for initiate()
  async initialize(request: InitiateOtpRequest): Promise<InitiateOtpResponse> {
    return this.initiate(request);
  }
}
