import { HttpClient } from '../http-client';
import { GetCountrySpecificationsResponse } from '../types';

export class Spec {
  constructor(private httpClient: HttpClient) {}

  async countries(): Promise<GetCountrySpecificationsResponse> {
    return this.httpClient.post<GetCountrySpecificationsResponse>('/spec/countries', {});
  }
}
