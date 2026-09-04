export type FileReferenceKind = 'file' | 'file_link' | string;

export interface FileReferenceInput {
  fileId: string;
  field: string;
  reference?: string;
  referenceKind?: FileReferenceKind;
  purpose?: string;
}

export interface FileReferenceReconcileRequest {
  resourceType: string;
  resourceId: string;
  references?: FileReferenceInput[];
}

export interface FileReferenceReconciliation {
  reconciled?: boolean;
  error?: Record<string, unknown>;
}
