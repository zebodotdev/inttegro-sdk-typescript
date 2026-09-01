import { basename } from 'node:path';
import { readFile } from 'node:fs/promises';

import { HttpClient } from '../http-client';
import {
  RequestOptions,
  UploadRequestCancelRequest,
  UploadRequestCreateRequest,
  UploadRequestFulfillRequest,
  UploadRequestFulfillResponse,
  UploadRequestLookupRequest,
  UploadRequestPageRequest,
  UploadRequestPageResponse,
  UploadRequestReviewRequest,
  UploadRequestResponse,
} from '../types';

export class UploadRequests {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: UploadRequestCreateRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequestResponse> {
    return this.httpClient.post<UploadRequestResponse>('/upload_requests/create', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: UploadRequestLookupRequest): Promise<UploadRequestResponse> {
    return this.httpClient.post<UploadRequestResponse>('/upload_requests/lookup', request);
  }

  async page(request: UploadRequestPageRequest = {}): Promise<UploadRequestPageResponse> {
    return this.httpClient.post<UploadRequestPageResponse>('/upload_requests/page', request);
  }

  async cancel(
    request: UploadRequestCancelRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequestResponse> {
    return this.httpClient.post<UploadRequestResponse>('/upload_requests/cancel', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async review(
    request: UploadRequestReviewRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequestResponse> {
    return this.httpClient.post<UploadRequestResponse>('/upload_requests/review', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async fulfill(request: UploadRequestFulfillRequest): Promise<UploadRequestFulfillResponse> {
    const form = new FormData();
    await appendFile(form, request.file, request.filename);
    return this.httpClient.postForm<UploadRequestFulfillResponse>(
      request.upload_url,
      form,
      {},
      false
    );
  }
}

async function appendFile(form: FormData, file: string | Blob, filename?: string): Promise<void> {
  if (typeof file === 'string') {
    const data = await readFile(file);
    form.append('file', new Blob([data]), filename || basename(file));
    return;
  }

  form.append('file', file, filename);
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
