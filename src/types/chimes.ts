import { CustomData, RequestMeta } from './common';
import type { MessageTemplateReference } from './message-templates';
import type { Broadcast } from './broadcasts';
import { ScheduledChime } from './schedules';

export type ChimeTransport = 'sms' | 'email';
export type ChimeRecipientType = 'phone' | 'email';
export type ChimeRecipientTransport = 'sms' | 'email';

export interface ChimeRecipientPhone {
  number: string;
}

export interface ChimeRecipientEmail {
  address: string;
}

export type ChimeRecipient =
  | {
      type: 'phone';
      name?: string;
      phone: ChimeRecipientPhone;
      email?: never;
      customer_id?: never;
      transport?: never;
    }
  | {
      type: 'email';
      name?: string;
      email: ChimeRecipientEmail;
      phone?: never;
      customer_id?: never;
      transport?: never;
    }
  | {
      customer_id: string;
      transport: ChimeRecipientTransport;
      type?: never;
      name?: never;
      phone?: never;
      email?: never;
    };

export interface ChimeEmailAddress {
  address: string;
  name?: string;
}

export interface ChimeEmailMessageInput {
  subject: string;
  text: string;
  html?: string;
  from: ChimeEmailAddress;
  reply_to?: string;
  headers?: Record<string, string>;
}

export interface ChimeEmailMessage {
  subject?: string;
  text?: string;
  html?: string | null;
  from?: ChimeEmailAddress;
  reply_to?: ChimeEmailAddress;
  headers?: Record<string, string>;
}

interface SendChimeRequestBase {
  recipient: ChimeRecipient;
  sender_id?: string;
  purpose?: string;
  custom_data?: CustomData;
  request_meta?: RequestMeta;
}

export type SendChimeRequest =
  | (SendChimeRequestBase & {
      full_message: string;
      email?: never;
      message_template?: never;
    })
  | (SendChimeRequestBase & {
      full_message?: never;
      email: ChimeEmailMessageInput;
      message_template?: never;
    })
  | (SendChimeRequestBase & {
      full_message?: never;
      email?: never;
      message_template: MessageTemplateReference;
    });

interface ScheduleChimeRequestBase {
  recipients: ChimeRecipient[];
  send_after: string;
  sender_id?: string;
  purpose?: string | null;
  request_meta?: RequestMeta;
}

export type ScheduleChimeRequest =
  | (ScheduleChimeRequestBase & {
      full_message: string;
      email?: never;
      message_template?: never;
    })
  | (ScheduleChimeRequestBase & {
      full_message?: never;
      email: ChimeEmailMessageInput;
      message_template?: never;
    })
  | (ScheduleChimeRequestBase & {
      full_message?: never;
      email?: never;
      message_template: MessageTemplateReference;
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

export interface Chime {
  id?: string;
  created_at?: string;
  full_message?: string;
  email?: ChimeEmailMessage;
  recipient?: ChimeRecipient;
  sender_id?: string;
  purpose?: string | null;
  custom_data?: CustomData;
  delivery?: Record<string, unknown> | null;
  transmission?: ChimeTransmission | null;
}

export type BroadcastChimeMessageTemplate = string | MessageTemplateReference;

export interface BroadcastChimeRequest {
  message_template?: BroadcastChimeMessageTemplate;
  email?: ChimeEmailMessageInput;
  purpose?: string;
  recipients: ChimeRecipient[];
  sender?: string;
  request_meta?: RequestMeta;
}

export interface PageChimesRequest {
  customer_id?: string;
  page_number?: number;
  page_size?: number;
  recipient?: string;
}

export interface ChimePage {
  number?: number;
  size?: number;
  chimes?: Chime[];
}

export type { Broadcast, ScheduledChime };
