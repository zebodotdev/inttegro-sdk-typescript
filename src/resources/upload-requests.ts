import { basename } from 'node:path';
import { readFile } from 'node:fs/promises';

import { HttpClient } from '../http-client';
import {
  RequestOptions,
  UploadFulfillment,
  UploadRequest,
  UploadRequestCancelRequest,
  UploadRequestCreateRequest,
  UploadRequestFulfillRequest,
  UploadRequestLookupRequest,
  UploadRequestPageRequest,
  UploadRequestPage,
  UploadRequestReviewRequest,
} from '../types';

export class UploadRequests {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: UploadRequestCreateRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequest> {
    return this.httpClient.postResource<UploadRequest>(
      '/upload_requests/create',
      'upload_request',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async lookup(request: UploadRequestLookupRequest): Promise<UploadRequest> {
    return this.httpClient.postResource<UploadRequest>(
      '/upload_requests/lookup',
      'upload_request',
      request
    );
  }

  async page(request: UploadRequestPageRequest = {}): Promise<UploadRequestPage> {
    return this.httpClient.postResource<UploadRequestPage>(
      '/upload_requests/page',
      'page',
      request
    );
  }

  async cancel(
    request: UploadRequestCancelRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequest> {
    return this.httpClient.postResource<UploadRequest>(
      '/upload_requests/cancel',
      'upload_request',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async review(
    request: UploadRequestReviewRequest,
    options: RequestOptions = {}
  ): Promise<UploadRequest> {
    return this.httpClient.postResource<UploadRequest>(
      '/upload_requests/review',
      'upload_request',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async fulfill(request: UploadRequestFulfillRequest): Promise<UploadFulfillment> {
    const form = new FormData();
    await appendFile(form, request.file, request.filename);
    return this.httpClient.postForm<UploadFulfillment>(request.uploadUrl, form, {}, false);
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
