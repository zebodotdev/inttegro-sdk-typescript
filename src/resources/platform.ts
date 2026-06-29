import { HttpClient } from '../http-client';
import {
  CreateAppRequest,
  CreateAppResponse,
  GenerateKeyRequest,
  GenerateKeyResponse,
  NewSessionRequest,
  NewSessionResponse,
} from '../types';

/**
  * Platform-level endpoints for apps/keys/sessions
  */
export class Platform {
  constructor(private httpClient: HttpClient) {}

  async createApp(request: CreateAppRequest): Promise<CreateAppResponse> {
    return this.httpClient.post<CreateAppResponse>('/apps/create', request);
  }

  async generateKey(request: GenerateKeyRequest): Promise<GenerateKeyResponse> {
    return this.httpClient.post<GenerateKeyResponse>('/keys/generate', request);
  }

  async newSession(request: NewSessionRequest): Promise<NewSessionResponse> {
    return this.httpClient.post<NewSessionResponse>('/sessions/new', request);
  }
}
