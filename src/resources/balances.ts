import { HttpClient } from '../http-client';
import { BalanceSnapshot } from '../types';

export class Balances {
  constructor(private httpClient: HttpClient) {}

  async get(): Promise<BalanceSnapshot> {
    return this.httpClient.postResource<BalanceSnapshot>('/balances', 'balances', {});
  }
}
