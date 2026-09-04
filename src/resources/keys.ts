import { HttpClient } from '../http-client';
import {
  DestroySecretKeyRequest,
  GenerateSecretKeyRequest,
  GeneratedSecretKey,
  LookupSecretKeyRequest,
  PageSecretKeysRequest,
  SecretKey,
  SecretKeyPage,
  SecretKeyUsageRequest,
  SecretKeyUsage,
  UpdateSecretKeyRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import type { ValidationError } from '../utils/validation';

export class Keys {
  constructor(private httpClient: HttpClient) {}

  async generate(request: GenerateSecretKeyRequest = {}): Promise<GeneratedSecretKey> {
    return this.httpClient.postResource<GeneratedSecretKey>('/keys/generate', 'key', request);
  }

  async page(request: PageSecretKeysRequest = {}): Promise<SecretKeyPage> {
    return this.httpClient.postResource<SecretKeyPage>('/keys/page', 'page', request);
  }

  async lookup(request: LookupSecretKeyRequest): Promise<SecretKey> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.postResource<SecretKey>('/keys/lookup', 'key', request);
  }

  async update(request: UpdateSecretKeyRequest): Promise<SecretKey> {
    const errors = validateSecretKeyIdentifier(request);
    if (!Object.prototype.hasOwnProperty.call(request, 'label')) {
      errors.push({ field: 'label', message: "Field 'label' is required" });
    }
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<SecretKey>('/keys/update', 'key', request);
  }

  async destroy(request: DestroySecretKeyRequest): Promise<SecretKey> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.postResource<SecretKey>('/keys/destroy', 'key', request);
  }

  async usage(request: SecretKeyUsageRequest): Promise<SecretKeyUsage> {
    throwIfValidationErrors(validateSecretKeyIdentifier(request));
    return this.httpClient.post<SecretKeyUsage>('/keys/usage', request);
  }
}

function validateSecretKeyIdentifier(request: LookupSecretKeyRequest): ValidationError[] {
  return validateRequired({ secretKeyId: request.secretKeyId }, ['secret_key_id']);
}
