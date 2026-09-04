export const SecretKeyTokenTypes = { Bearer: 'bearer' } as const;
export type SecretKeyTokenType = (typeof SecretKeyTokenTypes)[keyof typeof SecretKeyTokenTypes];

export const SecretKeyStatuses = {
  Active: 'active',
  Revoked: 'revoked',
  Expired: 'expired',
} as const;
export type SecretKeyStatus = (typeof SecretKeyStatuses)[keyof typeof SecretKeyStatuses];

export const SecretKeyAuthResults = { Succeeded: 'succeeded', Failed: 'failed' } as const;
export type SecretKeyAuthResult = (typeof SecretKeyAuthResults)[keyof typeof SecretKeyAuthResults];

export interface GenerateSecretKeyRequest {
  label?: string;
}

export interface GeneratedSecretKey {
  id: string;
  label?: string;
  tokenType: SecretKeyTokenType;
  issuedAt: string;
  token: string;
}

export interface SecretKey {
  id: string;
  label?: string;
  tokenType: SecretKeyTokenType;
  issuedAt: string;
  updatedAt?: string;
  expiresAt?: string;
  status: SecretKeyStatus;
  active: boolean;
  revokedAt?: string;
  lastUsedAt?: string;
  usageCount?: number;
}

export interface LookupSecretKeyRequest {
  secretKeyId: string;
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
  hasMore: boolean;
  keys: SecretKey[];
}

export interface SecretKeyUsageRequest extends LookupSecretKeyRequest {
  page?: number;
  number?: number;
  size?: number;
}

export interface SecretKeyUsageRow {
  secretKeyId: string;
  occurredAt: string;
  authResult: SecretKeyAuthResult;
}

export interface SecretKeyUsagePage {
  number: number;
  size: number;
  count: number;
  total: number;
  hasMore: boolean;
  rows: SecretKeyUsageRow[];
}

export interface SecretKeyUsage {
  key: SecretKey;
  usage: SecretKeyUsagePage;
}
