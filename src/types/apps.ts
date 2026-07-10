export interface CreateAppRequest {
  name: string;
  alias?: string;
  description?: string;
  legal_entity_type?: 'government' | 'non_profit' | 'business' | 'individual';
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
}

export interface CreateAppResponse {
  app: App;
}

export interface LookupAppResponse {
  app: App;
}

export interface UpdateAppRequest {
  name?: string;
  alias?: string;
  description?: string;
  legal_entity_type?: 'government' | 'non_profit' | 'business' | 'individual';
}

export interface UpdateAppResponse {
  app: App;
}
