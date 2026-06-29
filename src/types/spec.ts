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
}

export interface GetCountrySpecificationsResponse {
  countries?: Record<string, CountrySpecification>;
}
