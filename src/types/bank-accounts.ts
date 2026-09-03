export const BankAccountTypes = { GhanaBankAccount: 'ghana_bank_account' } as const;
export type BankAccountType = (typeof BankAccountTypes)[keyof typeof BankAccountTypes];

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
