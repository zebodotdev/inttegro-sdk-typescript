export type SecretKeyTokenType = 'bearer' | string;
export type SecretKeyStatus = 'active' | 'revoked' | 'expired' | string;
export type SecretKeyUsageRowType = 'session' | 'verification' | string;
export type SecretKeyAuthResult = 'succeeded' | 'failed' | string;

export interface SecretKeyActorRequest {
  service?: string;
  user_id?: string;
  team_member_id?: string;
  email?: string;
  name?: string;
}

export interface SecretKeyAuditRequest {
  user_agent?: string;
  remote_addr?: string;
  actor?: SecretKeyActorRequest;
}

export interface GenerateSecretKeyRequest extends SecretKeyAuditRequest {
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
  updated_by?: string;
  expires_at?: string;
  status: SecretKeyStatus;
  active: boolean;
  revoked_at?: string;
  revoked_by?: string;
  request_id?: string;
  ip_address?: string;
  user_agent?: string;
  key_gen?: string;
  generated_by_service?: string;
  generated_by_user_id?: string;
  generated_by_team_member_id?: string;
  generated_by_email?: string;
  generated_by_name?: string;
  revocation_request_id?: string;
  revocation_ip_address?: string;
  revocation_user_agent?: string;
  revoked_by_service?: string;
  revoked_by_user_id?: string;
  revoked_by_team_member_id?: string;
  revoked_by_email?: string;
  revoked_by_name?: string;
  cipher_text_prefix?: string;
  cipher_text_length?: number;
  last_used_at?: string;
  usage_count: number;
  usage_metrics_available: boolean;
}

export interface LookupSecretKeyRequest {
  secret_key_id?: string;
  key_id?: string;
  id?: string;
}

export interface UpdateSecretKeyRequest extends LookupSecretKeyRequest, SecretKeyAuditRequest {
  label: string;
}

export interface DestroySecretKeyRequest extends LookupSecretKeyRequest, SecretKeyAuditRequest {}

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
  usage_metrics_available: boolean;
  keys: SecretKey[];
}

export interface SecretKeyUsageRequest extends LookupSecretKeyRequest {
  page?: number;
  number?: number;
  size?: number;
}

export interface SecretKeyUsageRow {
  id: string;
  type: SecretKeyUsageRowType;
  secret_key_id: string;
  session_id?: string;
  verification_id?: string;
  request_id?: string;
  occurred_at: string;
  created_at?: string;
  initiated_at?: string;
  expires_at?: string;
  ip_address?: string;
  user_agent?: string;
  verified: boolean;
  auth_result: SecretKeyAuthResult;
  multi_use?: boolean;
}

export interface SecretKeyUsagePage {
  number: number;
  size: number;
  count: number;
  total: number;
  has_more: boolean;
  verification_attempts_available: boolean;
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
