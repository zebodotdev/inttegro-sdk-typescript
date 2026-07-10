import { HttpClient } from '../http-client';
import {
  CreateAppRequest,
  CreateAppResponse,
  LookupAppResponse,
  UpdateAppRequest,
  UpdateAppResponse,
} from '../types';

/** Application management endpoints. */
export class Apps {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreateAppRequest): Promise<CreateAppResponse> {
    return this.httpClient.post<CreateAppResponse>('/apps/create', request);
  }

  async lookup(): Promise<LookupAppResponse> {
    return this.httpClient.post<LookupAppResponse>('/apps/lookup', {});
  }

  async update(request: UpdateAppRequest): Promise<UpdateAppResponse> {
    return this.httpClient.post<UpdateAppResponse>('/apps/update', request);
  }
}
