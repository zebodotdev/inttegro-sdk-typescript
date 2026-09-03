export type FileReferenceKind = 'file' | 'file_link' | string;

export interface FileReferenceInput {
  file_id: string;
  field: string;
  reference?: string;
  reference_kind?: FileReferenceKind;
  purpose?: string;
}

export interface FileReferenceReconcileRequest {
  resource_type: string;
  resource_id: string;
  references?: FileReferenceInput[];
}

export interface FileReferenceReconciliation {
  reconciled?: boolean;
  error?: Record<string, unknown>;
}
