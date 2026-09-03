export type MessageTemplateChannel = 'sms' | 'email';
export type MessageTemplateStatus = 'draft' | 'published' | 'archived';
export type MessageTemplateVariableType =
  | 'array'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'integer'
  | 'number'
  | 'phone'
  | 'string'
  | 'url';

export interface MessageTemplateVariable {
  name: string;
  type: MessageTemplateVariableType;
  about?: string;
  default?: unknown;
  items?: MessageTemplateVariable[];
  required?: boolean;
}

export interface MessageTemplateSmsContent {
  message_template: string;
}

export interface MessageTemplateMailbox {
  email?: string;
  name?: string;
}

export interface MessageTemplateEmailContent {
  from?: MessageTemplateMailbox | null;
  headers?: Record<string, string>;
  html: string;
  reply_to?: MessageTemplateMailbox | null;
  subject: string;
}

export interface MessageTemplate {
  id: string;
  about?: string | null;
  archived_at?: string | null;
  attachments?: string[];
  channel: MessageTemplateChannel;
  created_at: string;
  draft_version: number;
  email?: MessageTemplateEmailContent | null;
  has_unpublished_changes: boolean;
  locale: string;
  name: string;
  published_at?: string | null;
  published_version?: number | null;
  purpose: string;
  sms?: MessageTemplateSmsContent | null;
  status: MessageTemplateStatus;
  updated_at: string;
  variables?: MessageTemplateVariable[];
  version: number;
}

export interface MessageTemplateCreateRequest {
  name: string;
  channel: MessageTemplateChannel;
  purpose: string;
  about?: string;
  attachments?: string[];
  email?: MessageTemplateEmailContent;
  locale?: string;
  sms?: MessageTemplateSmsContent;
  variables?: MessageTemplateVariable[];
}

export interface MessageTemplateUpdateRequest {
  id: string;
  about?: string;
  attachments?: string[];
  channel?: MessageTemplateChannel;
  email?: MessageTemplateEmailContent;
  locale?: string;
  name?: string;
  purpose?: string;
  sms?: MessageTemplateSmsContent;
  variables?: MessageTemplateVariable[];
}

export interface MessageTemplateActionRequest {
  id: string;
}

export interface MessageTemplateLookupRequest {
  id: string;
}

export interface MessageTemplatePageRequest {
  channel?: MessageTemplateChannel;
  locale?: string;
  page?: number;
  purpose?: string;
  size?: number;
  status?: MessageTemplateStatus;
}

export interface MessageTemplateReference {
  template_id: string;
  variables?: Record<string, unknown>;
}

export interface MessageTemplateRenderPreviewRequest {
  message_template: MessageTemplateReference;
}

export interface MessageTemplatePage {
  number?: number;
  size?: number;
  message_templates?: MessageTemplate[];
}

export interface MessageTemplateRenderedContent {
  channel: MessageTemplateChannel;
  email?: Record<string, unknown>;
  sms?: {
    full_message?: string;
  };
}

export interface MessageTemplatePreview {
  message_template: MessageTemplate;
  rendered: MessageTemplateRenderedContent;
}
