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
  holder?: BankAccountOwner;
}

export interface BankAccountConfig {
  id?: string;
  type: BankAccountType;
  ghana_bank_account?: GhanaBankAccount;
}

interface FinancialAccountRequestBase {
  label: string;
  reference: string;
  currency: string;
  description?: string;
  pull_configuration?: PullPushConfig;
  push_configuration?: PullPushConfig;
  custom_data?: Record<string, unknown>;
}

export interface FinancialAccountWalletRequest extends FinancialAccountRequestBase {
  type: 'wallet';
  owner: BankAccountOwner;
  wallet: WalletConfig;
  bank_account?: never;
  dosh_account?: never;
}

export type FinancialAccountBankRequest = FinancialAccountRequestBase & {
  type: 'bank_account';
  bank_account: BankAccountConfig;
  wallet?: never;
  dosh_account?: never;
  owner?: BankAccountOwner;
};

export interface FinancialAccountDoshRequest extends FinancialAccountRequestBase {
  type: 'dosh_account';
  owner: BankAccountOwner;
  dosh_account: Record<string, never>;
  wallet?: never;
  bank_account?: never;
}

export type CreateFinancialAccountRequest =
  | FinancialAccountWalletRequest
  | FinancialAccountBankRequest
  | FinancialAccountDoshRequest;

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

export interface LookupFinancialAccountRequest {
  account_id: string;
}

export interface ArchiveFinancialAccountRequest {
  account_id?: string;
}

export interface PageFinancialAccountsRequest {
  page_number?: number;
  page_size?: number;
}

export interface FinancialAccountPage {
  number?: number;
  size?: number;
  accounts?: FinancialAccount[];
}

export interface VerifyFinancialAccountRequest {
  account_id?: string;
  [key: string]: unknown;
}

export type ConnectFinancialAccountRequest = CreateFinancialAccountRequest;

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
