import { HttpClient } from '../http-client';
import { CountrySpecifications } from '../types';

export class Spec {
  constructor(private httpClient: HttpClient) {}

  async countries(): Promise<CountrySpecifications> {
    return this.httpClient.postResource<CountrySpecifications>('/spec/countries', 'countries', {});
  }
}
