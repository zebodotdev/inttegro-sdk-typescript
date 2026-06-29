export interface LookupScheduleRequest {
  schedule_id: string;
}

export interface CancelScheduleRequest {
  schedule_id: string;
}

export interface ScheduleError {
  recipient?: string;
  fix_code?: string;
  type?: string;
}

export interface ScheduleDetail {
  id?: string;
  recipients?: string[];
  content?: string;
  sender_id?: string;
  purpose?: string | null;
  send_after?: string;
  created_at?: string;
  executed_at?: string | null;
  canceled_at?: string | null;
  errors?: ScheduleError[];
  chime_ids?: string[];
}

export interface ScheduledChime {
  id?: string;
  recipients?: string[];
  full_message?: string;
  sender_id?: string;
  purpose?: string | null;
  send_after?: string;
  created_at?: string;
  executed_at?: string | null;
}

export interface ScheduleLookupResponse {
  scheduled_chime?: ScheduleDetail;
}

export interface ScheduleCancelResponse {
  scheduled_chime?: ScheduleDetail;
}
