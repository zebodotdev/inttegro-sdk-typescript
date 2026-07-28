import { HttpClient } from '../http-client';
import { PageBalanceTransactionsRequest, PageBalanceTransactionsResponse } from '../types';

export class BalanceTransactions {
  constructor(private httpClient: HttpClient) {}

  async page(
    request: PageBalanceTransactionsRequest = {}
  ): Promise<PageBalanceTransactionsResponse> {
    return this.httpClient.post<PageBalanceTransactionsResponse>(
      '/balance_transactions/page',
      request
    );
  }
}
