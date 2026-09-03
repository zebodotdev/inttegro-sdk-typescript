import { HttpClient } from '../http-client';
import {
  FileLinkCreateRequest,
  FileLink,
  FileLinkCreation,
  FileLinkLookupRequest,
  FileLinkOpenRequest,
  FileLinkPageRequest,
  FileLinkPage,
  FileLinkRevokeRequest,
  RequestOptions,
} from '../types';
import { FileDownload } from './file-download';

export class FileLinks {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: FileLinkCreateRequest,
    options: RequestOptions = {}
  ): Promise<FileLinkCreation> {
    return this.httpClient.post<FileLinkCreation>('/file_links/create', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: FileLinkLookupRequest): Promise<FileLink> {
    return this.httpClient.postResource<FileLink>('/file_links/lookup', 'file_link', request);
  }

  async page(request: FileLinkPageRequest = {}): Promise<FileLinkPage> {
    return this.httpClient.postResource<FileLinkPage>('/file_links/page', 'page', request);
  }

  async revoke(request: FileLinkRevokeRequest, options: RequestOptions = {}): Promise<FileLink> {
    return this.httpClient.postResource<FileLink>('/file_links/revoke', 'file_link', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async open(request: FileLinkOpenRequest): Promise<FileDownload> {
    const response = await this.httpClient.raw(request.url, { method: 'GET' }, false);
    const download = new FileDownload(() => response.arrayBuffer());
    if (request.save_to) {
      await download.saveTo(request.save_to);
    }
    return download;
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
