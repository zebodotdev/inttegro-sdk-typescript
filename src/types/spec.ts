export interface FinancialAccountTypeSpec {
  name?: string;
  label?: string;
  description?: string;
  subtypes?: string[];
}

export interface LegalEntityTypeSpec {
  type?: string;
  name?: string;
  description?: string;
}

export interface IDDocumentTypeSpec {
  name?: string;
  label?: string;
  description?: string;
}

export interface BankBranchSpec {
  id?: string;
  name?: string;
  sort_code?: string;
}

export interface BankSpec {
  id?: string;
  name?: string;
  swift_code?: string;
  sort_code_prefix?: string;
  branches?: BankBranchSpec[];
}

export interface CountryBankSpec {
  bank_account_type?: string;
  code_scheme?: string;
  items?: BankSpec[];
}

export interface CountrySpecification {
  country_code?: string;
  country_name?: string;
  currencies?: string[];
  payment_methods?: string[];
  payout_schedules?: string[];
  bt_aging_specs?: string[];
  legal_entity_types?: LegalEntityTypeSpec[];
  financial_account_types?: FinancialAccountTypeSpec[];
  id_document_types?: IDDocumentTypeSpec[];
  banks?: CountryBankSpec;
}

export type CountrySpecifications = Record<string, CountrySpecification>;
