import { HttpClient } from '../http-client';
import {
  ArchiveFinancialAccountRequest,
  ConnectFinancialAccountRequest,
  CreateFinancialAccountRequest,
  CreateFinancialAccountResponse,
  LookupFinancialAccountRequest,
  LookupFinancialAccountResponse,
  PageFinancialAccountsRequest,
  PageFinancialAccountsResponse,
  ToggleFinancialAccountRequest,
  UpdateFinancialAccountRequest,
  VerifyFinancialAccountRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Financial Accounts resource for wallets/bank accounts
 */
export class FinancialAccounts {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: CreateFinancialAccountRequest
  ): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'label',
      'type',
      'reference',
      'currency',
      'owner',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/create', request);
  }

  async lookup(
    request: LookupFinancialAccountRequest
  ): Promise<LookupFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<LookupFinancialAccountResponse>('/financial_accounts/lookup', request);
  }

  async archive(request: ArchiveFinancialAccountRequest): Promise<unknown> {
    return this.httpClient.post('/financial_accounts/archive', request);
  }

  async page(request: PageFinancialAccountsRequest): Promise<PageFinancialAccountsResponse> {
    return this.httpClient.post<PageFinancialAccountsResponse>('/financial_accounts/page', request);
  }

  async verify(request: VerifyFinancialAccountRequest): Promise<unknown> {
    return this.httpClient.post('/financial_accounts/verify', request);
  }

  async update(request: UpdateFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/update', request);
  }

  async enablePush(request: ToggleFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/enable_push', request);
  }

  async disablePush(request: ToggleFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/disable_push', request);
  }

  async enablePull(request: ToggleFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/enable_pull', request);
  }

  async disablePull(request: ToggleFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/disable_pull', request);
  }

  async disconnect(request: ToggleFinancialAccountRequest): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['account_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/disconnect', request);
  }

  async connect(
    request: ConnectFinancialAccountRequest
  ): Promise<CreateFinancialAccountResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'label',
      'type',
      'reference',
      'currency',
      'owner',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<CreateFinancialAccountResponse>('/financial_accounts/connect', request);
  }
}
