export type FinancialAccountType = 'wallet' | 'bank_account' | 'dosh_account';
export type WalletType = 'mobile_money';
export type BankAccountType = 'ghana_bank_account';

export interface WalletConfig {
  type: WalletType;
  mobile_money?: {
    id?: string;
    account_number: string;
    network: string;
  };
}

export interface PullPushConfig {
  enabled?: boolean;
  enabled_at?: string;
  mandate?: Record<string, unknown> | null;
}

export interface BankAccountOwnerAddress {
  id?: string;
  application_id?: string;
  name: string;
  phone?: string;
  line_1: string;
  line_2?: string;
  city: string;
  region: string;
  post_code?: string;
  country: string;
}

export interface BankAccountOwner {
  name: string;
  address: BankAccountOwnerAddress;
}

export interface GhanaBankAccount {
  bank_name?: string;
  branch?: string;
  number: string;
  sort_code?: string;
  swift_code?: string;
  holder: BankAccountOwner;
}

export interface BankAccountConfig {
  id?: string;
  type: BankAccountType;
  ghana_bank_account?: GhanaBankAccount;
}

export interface CreateFinancialAccountRequest {
  label: string;
  type: FinancialAccountType;
  reference: string;
  currency: string;
  description?: string;
  pull_configuration?: PullPushConfig;
  push_configuration?: PullPushConfig;
  wallet?: WalletConfig;
  bank_account?: BankAccountConfig;
  dosh_account?: Record<string, unknown>;
  custom_data?: Record<string, string>;
  owner: BankAccountOwner;
  verification?: Record<string, unknown> | null;
  archived_at?: string | null;
  created_at?: string;
}

export interface FinancialAccount {
  id?: string;
  label?: string;
  type?: FinancialAccountType;
  reference?: string;
  currency?: string;
  description?: string;
  pull_configuration?: PullPushConfig;
  push_configuration?: PullPushConfig;
  wallet?: WalletConfig;
  bank_account?: BankAccountConfig;
  dosh_account?: Record<string, unknown>;
  custom_data?: Record<string, string>;
  owner?: BankAccountOwner;
  disconnected_at?: string | null;
  created_at?: string;
}

export interface CreateFinancialAccountResponse {
  account?: FinancialAccount;
}

export interface LookupFinancialAccountRequest {
  account_id: string;
}

export interface LookupFinancialAccountResponse {
  account?: FinancialAccount;
}

export interface ArchiveFinancialAccountRequest {
  account_id?: string;
}

export interface PageFinancialAccountsRequest {
  page_number?: number;
  page_size?: number;
}

export interface PageFinancialAccountsResponse {
  page?: {
    number?: number;
    size?: number;
    accounts?: FinancialAccount[];
  };
}

export interface VerifyFinancialAccountRequest {
  account_id?: string;
  [key: string]: unknown;
}

export interface ConnectFinancialAccountRequest extends CreateFinancialAccountRequest {}

export interface UpdateFinancialAccountRequest {
  account_id: string;
  label?: string;
  description?: string;
  reference?: string;
  custom_data?: Record<string, string | null>;
  owner?: BankAccountOwner;
}

export interface ToggleFinancialAccountRequest {
  account_id: string;
  unset_as_payout_destination?: boolean;
}

export interface ReconnectFinancialAccountRequest {
  account_id: string;
}

export interface ReconnectFinancialAccountResponse {
  account?: FinancialAccount;
}
