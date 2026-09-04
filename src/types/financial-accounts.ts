import type { BankAccountConfig, BankAccountOwner } from './bank-accounts';
import type { WalletConfig } from './wallets';

export const FinancialAccountTypes = {
  Wallet: 'wallet',
  BankAccount: 'bank_account',
  DoshAccount: 'dosh_account',
} as const;
export type FinancialAccountType =
  (typeof FinancialAccountTypes)[keyof typeof FinancialAccountTypes];

export interface PullPushConfig {
  enabled?: boolean;
  enabledAt?: string;
  mandate?: Record<string, unknown> | null;
}

interface FinancialAccountRequestBase {
  label: string;
  reference: string;
  currency: string;
  description?: string;
  pullConfiguration?: PullPushConfig;
  pushConfiguration?: PullPushConfig;
  customData?: Record<string, unknown>;
}

export interface FinancialAccountWalletRequest extends FinancialAccountRequestBase {
  type: 'wallet';
  owner: BankAccountOwner;
  wallet: WalletConfig;
  bankAccount?: never;
  doshAccount?: never;
}

export type FinancialAccountBankRequest = FinancialAccountRequestBase & {
  type: 'bank_account';
  bankAccount: BankAccountConfig;
  wallet?: never;
  doshAccount?: never;
  owner?: BankAccountOwner;
};

export interface FinancialAccountDoshRequest extends FinancialAccountRequestBase {
  type: 'dosh_account';
  owner: BankAccountOwner;
  doshAccount: Record<string, never>;
  wallet?: never;
  bankAccount?: never;
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
  pullConfiguration?: PullPushConfig;
  pushConfiguration?: PullPushConfig;
  wallet?: WalletConfig;
  bankAccount?: BankAccountConfig;
  doshAccount?: Record<string, unknown>;
  customData?: Record<string, string>;
  owner?: BankAccountOwner;
  disconnectedAt?: string | null;
  createdAt?: string;
}

export interface LookupFinancialAccountRequest {
  accountId: string;
}

export interface ArchiveFinancialAccountRequest {
  accountId?: string;
}

export interface PageFinancialAccountsRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface FinancialAccountPage {
  number?: number;
  size?: number;
  accounts?: FinancialAccount[];
}

export interface VerifyFinancialAccountRequest {
  accountId?: string;
  [key: string]: unknown;
}

export type ConnectFinancialAccountRequest = CreateFinancialAccountRequest;

export interface UpdateFinancialAccountRequest {
  accountId: string;
  label?: string;
  description?: string;
  reference?: string;
  customData?: Record<string, string | null>;
  owner?: BankAccountOwner;
}

export interface ToggleFinancialAccountRequest {
  accountId: string;
  unsetAsPayoutDestination?: boolean;
}

export interface ReconnectFinancialAccountRequest {
  accountId: string;
}
