import { HttpClient } from '../http-client';
import {
  MessageTemplateActionRequest,
  MessageTemplate,
  MessageTemplateCreateRequest,
  MessageTemplateLookupRequest,
  MessageTemplatePageRequest,
  MessageTemplatePage,
  MessageTemplatePreview,
  MessageTemplateRenderPreviewRequest,
  MessageTemplateUpdateRequest,
  RequestOptions,
} from '../types';

export class MessageTemplates {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: MessageTemplateCreateRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplate> {
    return this.httpClient.postResource<MessageTemplate>(
      '/message_templates/create',
      'message_template',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async update(
    request: MessageTemplateUpdateRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplate> {
    return this.httpClient.postResource<MessageTemplate>(
      '/message_templates/update',
      'message_template',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async publish(
    request: MessageTemplateActionRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplate> {
    return this.httpClient.postResource<MessageTemplate>(
      '/message_templates/publish',
      'message_template',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async archive(
    request: MessageTemplateActionRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplate> {
    return this.httpClient.postResource<MessageTemplate>(
      '/message_templates/archive',
      'message_template',
      request,
      {
        headers: idempotencyHeaders(options.idempotencyKey),
      }
    );
  }

  async lookup(request: MessageTemplateLookupRequest): Promise<MessageTemplate> {
    return this.httpClient.postResource<MessageTemplate>(
      '/message_templates/lookup',
      'message_template',
      request
    );
  }

  async page(request: MessageTemplatePageRequest = {}): Promise<MessageTemplatePage> {
    return this.httpClient.postResource<MessageTemplatePage>(
      '/message_templates/page',
      'page',
      request
    );
  }

  async renderPreview(
    request: MessageTemplateRenderPreviewRequest
  ): Promise<MessageTemplatePreview> {
    return this.httpClient.post<MessageTemplatePreview>(
      '/message_templates/render_preview',
      request
    );
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
