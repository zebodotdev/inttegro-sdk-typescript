export const AppManagementRoles = { Parent: 'parent', Child: 'child' } as const;
export type AppManagementRole = (typeof AppManagementRoles)[keyof typeof AppManagementRoles];

export const AppCredentialOwners = { Child: 'child', Parent: 'parent' } as const;
export type AppCredentialOwner = (typeof AppCredentialOwners)[keyof typeof AppCredentialOwners];

export const AppRelationshipKinds = { Placement: 'placement' } as const;
export type AppRelationshipKind = (typeof AppRelationshipKinds)[keyof typeof AppRelationshipKinds];

export const AppRelationshipStatuses = {
  Active: 'active',
  Inactive: 'inactive',
  Suspended: 'suspended',
  Revoked: 'revoked',
} as const;
export type AppRelationshipStatus =
  (typeof AppRelationshipStatuses)[keyof typeof AppRelationshipStatuses];

export interface AppRelationshipPolicy {
  childStanding?: string;
  management?: AppManagementRole;
  credentials?: AppCredentialOwner;
}

export interface CreateAppRequest {
  name: string;
  alias?: string;
  description?: string;
  legalEntityType?: string;
  placementParentApplicationId?: string;
  relationshipPolicy?: AppRelationshipPolicy;
}

export interface AppRelationship {
  id: string;
  kind: AppRelationshipKind;
  policyVersion: string;
  status: AppRelationshipStatus;
  actorAppId: string;
  creatorAppId: string;
  placementParentAppId: string;
  subjectAppId: string;
  childAppId: string;
  childStanding: string;
  relationshipPolicy: Required<AppRelationshipPolicy>;
  retainedCreatorAuthorityExists: boolean;
  createdAt: string;
}

export interface App {
  id: string;
  name: string;
  alias?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  archivedAt?: string;
  secretKey?: {
    id: string;
    tokenType: string;
    issuedAt: string;
    token: string;
  };
  relationship?: AppRelationship;
}

export interface UpdateAppRequest {
  name?: string;
  alias?: string;
  description?: string;
  legalEntityType?: string;
}
