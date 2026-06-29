import { HttpClient } from '../http-client';
import { BalancesResponse } from '../types';

export class Balances {
  constructor(private httpClient: HttpClient) {}

  async get(): Promise<BalancesResponse> {
    return this.httpClient.post<BalancesResponse>('/balances', {});
  }
}
