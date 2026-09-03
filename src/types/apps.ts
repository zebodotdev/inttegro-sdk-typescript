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
  child_standing?: string;
  management?: AppManagementRole;
  credentials?: AppCredentialOwner;
}

export interface CreateAppRequest {
  name: string;
  alias?: string;
  description?: string;
  legal_entity_type?: string;
  placement_parent_application_id?: string;
  relationship_policy?: AppRelationshipPolicy;
}

export interface AppRelationship {
  id: string;
  kind: AppRelationshipKind;
  policy_version: string;
  status: AppRelationshipStatus;
  actor_app_id: string;
  creator_app_id: string;
  placement_parent_app_id: string;
  subject_app_id: string;
  child_app_id: string;
  child_standing: string;
  relationship_policy: Required<AppRelationshipPolicy>;
  retained_creator_authority_exists: boolean;
  created_at: string;
}

export interface App {
  id: string;
  name: string;
  alias?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  archived_at?: string;
  secret_key?: {
    id: string;
    token_type: string;
    issued_at: string;
    token: string;
  };
  relationship?: AppRelationship;
}

export interface UpdateAppRequest {
  name?: string;
  alias?: string;
  description?: string;
  legal_entity_type?: string;
}
