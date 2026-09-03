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

export interface Broadcast {
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
  customer_ids?: string[];
  email?: Record<string, unknown>;
}
