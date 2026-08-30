export type SecretKeyTokenType = 'bearer' | string;
export type SecretKeyStatus = 'active' | 'revoked' | 'expired' | string;
export type SecretKeyAuthResult = 'succeeded' | 'failed' | string;

export interface GenerateSecretKeyRequest {
  label?: string;
}

export interface GeneratedSecretKey {
  id: string;
  label?: string;
  token_type: SecretKeyTokenType;
  issued_at: string;
  token: string;
}

export interface SecretKey {
  id: string;
  label?: string;
  token_type: SecretKeyTokenType;
  issued_at: string;
  updated_at?: string;
  expires_at?: string;
  status: SecretKeyStatus;
  active: boolean;
  revoked_at?: string;
  last_used_at?: string;
  usage_count?: number;
}

export interface LookupSecretKeyRequest {
  secret_key_id: string;
}

export interface UpdateSecretKeyRequest extends LookupSecretKeyRequest {
  label: string;
}

export interface DestroySecretKeyRequest extends LookupSecretKeyRequest {}

export interface PageSecretKeysRequest {
  page?: number;
  number?: number;
  size?: number;
}

export interface SecretKeyPage {
  number: number;
  size: number;
  count: number;
  total: number;
  has_more: boolean;
  keys: SecretKey[];
}

export interface SecretKeyUsageRequest extends LookupSecretKeyRequest {
  page?: number;
  number?: number;
  size?: number;
}

export interface SecretKeyUsageRow {
  secret_key_id: string;
  occurred_at: string;
  auth_result: SecretKeyAuthResult;
}

export interface SecretKeyUsagePage {
  number: number;
  size: number;
  count: number;
  total: number;
  has_more: boolean;
  rows: SecretKeyUsageRow[];
}

export interface GenerateSecretKeyResponse {
  key?: GeneratedSecretKey;
}

export interface LookupSecretKeyResponse {
  key?: SecretKey;
}

export interface UpdateSecretKeyResponse {
  key?: SecretKey;
}

export interface DestroySecretKeyResponse {
  key?: SecretKey;
}

export interface PageSecretKeysResponse {
  page?: SecretKeyPage;
}

export interface SecretKeyUsageResponse {
  key?: SecretKey;
  usage?: SecretKeyUsagePage;
}
