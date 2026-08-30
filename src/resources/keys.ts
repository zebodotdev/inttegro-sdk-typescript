import { HttpClient } from '../http-client';
import {
  DestroySecretKeyRequest,
  DestroySecretKeyResponse,
  GenerateSecretKeyRequest,
  GenerateSecretKeyResponse,
  LookupSecretKeyRequest,
  LookupSecretKeyResponse,
  PageSecretKeysRequest,
  PageSecretKeysResponse,
  SecretKeyUsageRequest,
  SecretKeyUsageResponse,
  UpdateSecretKeyRequest,
  UpdateSecretKeyResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

export class Keys {
  constructor(private httpClient: HttpClient) {}

  async generate(request: GenerateSecretKeyRequest = {}): Promise<GenerateSecretKeyResponse> {
    return this.httpClient.post<GenerateSecretKeyResponse>('/keys/generate', request);
  }

  async page(request: PageSecretKeysRequest = {}): Promise<PageSecretKeysResponse> {
    return this.httpClient.post<PageSecretKeysResponse>('/keys/page', request);
  }

  async lookup(request: LookupSecretKeyRequest): Promise<LookupSecretKeyResponse> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.post<LookupSecretKeyResponse>('/keys/lookup', request);
  }

  async update(request: UpdateSecretKeyRequest): Promise<UpdateSecretKeyResponse> {
    const errors = validateSecretKeyIdentifier(request);
    if (!Object.prototype.hasOwnProperty.call(request, 'label')) {
      errors.push({ field: 'label', message: "Field 'label' is required" });
    }
    throwIfValidationErrors(errors);

    return this.httpClient.post<UpdateSecretKeyResponse>('/keys/update', request);
  }

  async destroy(request: DestroySecretKeyRequest): Promise<DestroySecretKeyResponse> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.post<DestroySecretKeyResponse>('/keys/destroy', request);
  }

  async usage(request: SecretKeyUsageRequest): Promise<SecretKeyUsageResponse> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.post<SecretKeyUsageResponse>('/keys/usage', request);
  }
}

function validateSecretKeyIdentifier(request: LookupSecretKeyRequest): ValidationError[] {
  const hasIdentifier = Boolean(request.secret_key_id || request.key_id || request.id);
  if (hasIdentifier) return [];

  return validateRequired({ secret_key_id: undefined }, ['secret_key_id']);
}
