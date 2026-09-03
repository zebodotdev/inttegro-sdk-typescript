import { basename } from 'node:path';
import { readFile } from 'node:fs/promises';

import { HttpClient } from '../http-client';
import {
  FileContentsRequest,
  FileCreateRequest,
  FileDeleteRequest,
  File,
  FilePage,
  FileLookupRequest,
  FilePageRequest,
  RequestOptions,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';
import { FileDownload } from './file-download';

export class Files {
  constructor(private httpClient: HttpClient) {}

  async create(request: FileCreateRequest, options: RequestOptions = {}): Promise<File> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'file',
      'purpose',
    ]);
    throwIfValidationErrors(errors);

    const form = new FormData();
    form.append('purpose', request.purpose);
    if (request.title) form.append('title', request.title);
    if (request.custom_data) form.append('custom_data', JSON.stringify(request.custom_data));
    await appendFile(form, request.file, request.filename);

    return this.httpClient.postFormResource<File>('/files/create', 'file', form, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: FileLookupRequest): Promise<File> {
    return this.httpClient.postResource<File>('/files/lookup', 'file', request);
  }

  async page(request: FilePageRequest = {}): Promise<FilePage> {
    return this.httpClient.postResource<FilePage>('/files/page', 'page', request);
  }

  async contents(request: FileContentsRequest): Promise<FileDownload> {
    const response = await this.httpClient.raw('/files/contents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return new FileDownload(response);
  }

  async delete(request: FileDeleteRequest): Promise<File> {
    return this.httpClient.postResource<File>('/files/delete', 'file', request);
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
