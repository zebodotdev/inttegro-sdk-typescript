import { HttpClient } from '../http-client';
import {
  LookupBalanceTransactionRequest,
  LookupBalanceTransactionResponse,
  PageBalanceTransactionsRequest,
  PageBalanceTransactionsResponse,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class BalanceTransactions {
  constructor(private httpClient: HttpClient) {}

  async lookup(
    request: LookupBalanceTransactionRequest
  ): Promise<LookupBalanceTransactionResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'transaction_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<LookupBalanceTransactionResponse>(
      '/balance_transactions/lookup',
      request
    );
  }

  async page(
    request: PageBalanceTransactionsRequest = {}
  ): Promise<PageBalanceTransactionsResponse> {
    return this.httpClient.post<PageBalanceTransactionsResponse>(
      '/balance_transactions/page',
      request
    );
  }
}
