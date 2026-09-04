export const BankAccountTypes = { GhanaBankAccount: 'ghana_bank_account' } as const;
export type BankAccountType = (typeof BankAccountTypes)[keyof typeof BankAccountTypes];

export interface BankAccountOwnerAddress {
  id?: string;
  applicationId?: string;
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postCode?: string;
  country: string;
}

export interface BankAccountOwner {
  name: string;
  address: BankAccountOwnerAddress;
}

export interface GhanaBankAccount {
  bankName?: string;
  branch?: string;
  number: string;
  sortCode?: string;
  swiftCode?: string;
  holder?: BankAccountOwner;
}

export interface BankAccountConfig {
  id?: string;
  type: BankAccountType;
  ghanaBankAccount?: GhanaBankAccount;
}
