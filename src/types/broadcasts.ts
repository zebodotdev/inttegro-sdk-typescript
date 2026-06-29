export interface LookupBroadcastRequest {
  broadcast_id: string;
}

export interface CancelBroadcastRequest {
  broadcast_id: string;
}

export interface BroadcastError {
  recipient?: string;
  fix_code?: string;
  type?: string;
}

export interface BroadcastDetail {
  id?: string;
  recipients?: string[];
  content?: string;
  sender_id?: string;
  purpose?: string | null;
  send_after?: string;
  created_at?: string;
  executed_at?: string | null;
  canceled_at?: string | null;
  errors?: BroadcastError[];
  chime_ids?: string[];
}

export interface LookupBroadcastResponse {
  broadcast?: BroadcastDetail;
}

export interface BroadcastCancelResponse {
  broadcast?: BroadcastDetail;
}
