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

export interface FileActor {
  type?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface FileSource {
  type?: string;
  id?: string;
}

export interface File {
  id: string;
  purpose: string;
  status: FileStatus;
  scan_status?: string;
  name?: string | null;
  filename?: string | null;
  content_type?: string;
  size?: number;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  title?: string | null;
  custom_data?: Record<string, string>;
  created_by?: FileActor;
  source?: FileSource;
}

export interface FilePage {
  number?: number;
  size?: number;
  files?: File[];
}

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

export interface FileLink {
  id: string;
  file_id: string;
  status: FileLinkStatus;
  expires_at?: string | null;
  created_at?: string;
  revoked_at?: string | null;
  custom_data?: Record<string, string>;
  metadata?: Record<string, string>;
  access?: Record<string, unknown>;
  delivery?: Record<string, unknown>;
}

export interface FileLinkPage {
  number?: number;
  size?: number;
  file_links?: FileLink[];
}

export interface FileLinkCreation {
  file_link: FileLink;
  url: string;
}

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

export interface UploadRequest {
  id: string;
  purpose: string;
  status: UploadRequestStatus;
  upload_url?: string;
  expires_at?: string | null;
  created_at?: string;
  canceled_at?: string | null;
  custom_data?: Record<string, string>;
  metadata?: Record<string, string>;
  constraints?: Record<string, unknown>;
  display?: Record<string, unknown>;
  recipient?: Record<string, unknown>;
  requester?: Record<string, unknown>;
  resource?: Record<string, unknown>;
  subject?: Record<string, unknown>;
  attempts?: Record<string, unknown>;
}

export interface UploadRequestPage {
  number?: number;
  size?: number;
  upload_requests?: UploadRequest[];
}

export interface UploadFulfillment {
  upload_request: UploadRequest;
  file: File;
}
import type {
  FileDisposition,
  FileLinkStatus,
  FileStatus,
  UploadRequestStatus,
  UploadReviewDecision,
} from './api-enums';
