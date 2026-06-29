import { HttpClient } from '../http-client';
import {
  FileLinkCreateRequest,
  FileLinkLookupRequest,
  FileLinkOpenRequest,
  FileLinkPageRequest,
  FileLinkPageResponse,
  FileLinkResponse,
  FileLinkRevokeRequest,
  RequestOptions,
} from '../types';
import { FileDownload } from './file-download';

export class FileLinks {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: FileLinkCreateRequest,
    options: RequestOptions = {}
  ): Promise<FileLinkResponse> {
    return this.httpClient.post<FileLinkResponse>('/file_links/create', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: FileLinkLookupRequest): Promise<FileLinkResponse> {
    return this.httpClient.post<FileLinkResponse>('/file_links/lookup', request);
  }

  async page(request: FileLinkPageRequest = {}): Promise<FileLinkPageResponse> {
    return this.httpClient.post<FileLinkPageResponse>('/file_links/page', request);
  }

  async revoke(
    request: FileLinkRevokeRequest,
    options: RequestOptions = {}
  ): Promise<FileLinkResponse> {
    return this.httpClient.post<FileLinkResponse>('/file_links/revoke', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async open(request: FileLinkOpenRequest): Promise<FileDownload> {
    const response = await this.httpClient.raw(request.url, { method: 'GET' }, false);
    const download = new FileDownload(response);
    if (request.save_to) {
      await download.saveTo(request.save_to);
    }
    return download;
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
