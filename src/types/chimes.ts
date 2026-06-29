import { CustomData, RequestMeta } from './common';
import { ScheduledChime } from './schedules';

export type ChimeTransport = 'sms' | 'email' | 'whatsapp' | string;
export type ChimeRecipientType = 'phone' | 'email';

export interface ChimeRecipientPhone {
  number: string;
}

export interface ChimeRecipientEmail {
  address: string;
}

export interface ChimeRecipient {
  type: ChimeRecipientType;
  name?: string;
  phone?: ChimeRecipientPhone;
  email?: ChimeRecipientEmail;
}

export interface ChimeEmailAddress {
  address: string;
  name?: string;
}

export interface ChimeEmailMessage {
  subject: string;
  text: string;
  html?: string;
  from: ChimeEmailAddress;
  reply_to?: ChimeEmailAddress;
  headers?: Record<string, string>;
}

interface SendChimeRequestBase {
  recipient: ChimeRecipient;
  transport?: ChimeTransport;
  sender?: string;
  purpose?: string;
  custom_data?: CustomData;
  request_meta?: RequestMeta;
}

export type SendChimeRequest =
  | (SendChimeRequestBase & {
      full_message: string;
      email?: never;
    })
  | (SendChimeRequestBase & {
      full_message?: never;
      email: ChimeEmailMessage;
    });

interface ScheduleChimeRequestBase {
  recipients?: string[];
  send_after?: string;
  sender_id?: string;
  purpose?: string | null;
  request_meta?: RequestMeta;
}

export type ScheduleChimeRequest =
  | (ScheduleChimeRequestBase & {
      full_message: string;
      email?: never;
    })
  | (ScheduleChimeRequestBase & {
      full_message?: never;
      email: ChimeEmailMessage;
    });

export interface LookupChimeRequest {
  chime_id: string;
}

export interface ChimeTransmission {
  created_at?: string;
  delivered_at?: string | null;
  failed_at?: string | null;
  sent_at?: string | null;
  sent_via?: ChimeTransport | null;
  status?: string;
}

export interface ChimeRecipientResponse extends ChimeRecipient {}

export interface Chime {
  id?: string;
  created_at?: string;
  full_message?: string;
  email?: ChimeEmailMessage;
  recipient?: ChimeRecipientResponse;
  sender_id?: string;
  purpose?: string | null;
  custom_data?: CustomData;
  delivery?: Record<string, unknown> | null;
  transmission?: ChimeTransmission | null;
}

export interface ChimeResponse {
  chime?: Chime;
}

export interface ScheduleChimeResponse {
  scheduled_chime?: ScheduledChime;
}
