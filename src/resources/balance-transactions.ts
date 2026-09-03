import { HttpClient } from '../http-client';
import {
  BalanceTransaction,
  BalanceTransactionPage,
  LookupBalanceTransactionRequest,
  PageBalanceTransactionsRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class BalanceTransactions {
  constructor(private httpClient: HttpClient) {}

  async lookup(request: LookupBalanceTransactionRequest): Promise<BalanceTransaction> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'transaction_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<BalanceTransaction>(
      '/balance_transactions/lookup',
      'transaction',
      request
    );
  }

  async page(request: PageBalanceTransactionsRequest = {}): Promise<BalanceTransactionPage> {
    return this.httpClient.postResource<BalanceTransactionPage>(
      '/balance_transactions/page',
      'page',
      request
    );
  }
}
