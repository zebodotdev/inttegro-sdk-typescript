import { HttpClient } from '../http-client';
import { FileReferenceReconcileRequest, FileReferenceReconcileResponse } from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class FileReferences {
  constructor(private httpClient: HttpClient) {}

  async reconcile(request: FileReferenceReconcileRequest): Promise<FileReferenceReconcileResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'resource_type',
      'resource_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<FileReferenceReconcileResponse>(
      '/file_references/reconcile',
      request
    );
  }
}
