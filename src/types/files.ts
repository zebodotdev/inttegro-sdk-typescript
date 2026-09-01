export interface RequestOptions {
  idempotencyKey?: string;
}

export interface FileCreateRequest {
  file: string | Blob;
  filename?: string;
  purpose: string;
  title?: string;
  custom_data?: Record<string, string>;
}

export interface FileLookupRequest {
  file_id: string;
}

export interface FilePageRequest {
  created_after?: string;
  created_before?: string;
  page_number?: number;
  page_size?: number;
  purpose?: string;
  status?: FileStatus;
}

export interface FileContentsRequest {
  disposition?: FileDisposition;
  file_id: string;
}

export interface FileDeleteRequest {
  file_id: string;
}

export type FileResponse = Record<string, unknown>;
export type FilePageResponse = Record<string, unknown>;

export interface FileLinkCreateRequest {
  access?: Record<string, unknown>;
  created_by?: Record<string, unknown>;
  delivery?: Record<string, unknown>;
  expires_at?: string;
  file_id: string;
  custom_data?: Record<string, string>;
}

export interface FileLinkLookupRequest {
  id: string;
}

export interface FileLinkPageRequest {
  file_id?: string;
  page_number?: number;
  page_size?: number;
  status?: FileLinkStatus;
}

export interface FileLinkRevokeRequest {
  id: string;
  revoked_by?: Record<string, unknown>;
}

export interface FileLinkOpenRequest {
  url: string;
  save_to?: string;
}

export type FileLinkResponse = Record<string, unknown>;
export type FileLinkPageResponse = Record<string, unknown>;

export interface UploadRequestCreateRequest {
  attempts?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
  display?: Record<string, unknown>;
  expires_at?: string;
  custom_data?: Record<string, string>;
  purpose: string;
  recipient?: Record<string, unknown>;
  requester?: Record<string, unknown>;
  resource?: Record<string, unknown>;
  subject?: Record<string, unknown>;
}

export interface UploadRequestLookupRequest {
  id: string;
}

export interface UploadRequestPageRequest {
  page_number?: number;
  page_size?: number;
  purpose?: string;
  resource?: Record<string, unknown>;
  status?: UploadRequestStatus;
}

export interface UploadRequestCancelRequest {
  canceled_by?: Record<string, unknown>;
  id: string;
}

export interface UploadRequestReviewReason {
  code: string;
  message: string;
  param?: string;
}

interface UploadRequestReviewBaseRequest {
  decision: UploadReviewDecision;
  id: string;
  public_message?: string;
  reasons?: UploadRequestReviewReason[];
}

export interface UploadRequestReviewByIdRequest extends UploadRequestReviewBaseRequest {
  attempt_id: string;
  attempt_ordinal?: never;
}

export interface UploadRequestReviewByOrdinalRequest extends UploadRequestReviewBaseRequest {
  attempt_id?: never;
  attempt_ordinal: number;
}

export type UploadRequestReviewRequest =
  | UploadRequestReviewByIdRequest
  | UploadRequestReviewByOrdinalRequest;

export interface UploadRequestFulfillRequest {
  file: string | Blob;
  filename?: string;
  upload_url: string;
}

export type UploadRequestResponse = Record<string, unknown>;
export type UploadRequestPageResponse = Record<string, unknown>;
export type UploadRequestFulfillResponse = Record<string, unknown>;
import type {
  FileDisposition,
  FileLinkStatus,
  FileStatus,
  UploadRequestStatus,
  UploadReviewDecision,
} from './api-enums';
