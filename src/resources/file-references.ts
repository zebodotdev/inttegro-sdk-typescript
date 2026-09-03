import { HttpClient } from '../http-client';
import { FileReferenceReconcileRequest, FileReferenceReconciliation } from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class FileReferences {
  constructor(private httpClient: HttpClient) {}

  async reconcile(request: FileReferenceReconcileRequest): Promise<FileReferenceReconciliation> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'resource_type',
      'resource_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<FileReferenceReconciliation>('/file_references/reconcile', request);
  }
}
