import { HttpClient } from '../http-client';
import { generateIdempotencyKey } from '../utils/idempotency';
import {
  MessageTemplateActionRequest,
  MessageTemplateCreateRequest,
  MessageTemplateLookupRequest,
  MessageTemplatePageRequest,
  MessageTemplatePageResponse,
  MessageTemplateRenderPreviewRequest,
  MessageTemplateRenderPreviewResponse,
  MessageTemplateResponse,
  MessageTemplateUpdateRequest,
  RequestOptions,
} from '../types';

export class MessageTemplates {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: MessageTemplateCreateRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplateResponse> {
    return this.httpClient.post<MessageTemplateResponse>('/message_templates/create', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async update(
    request: MessageTemplateUpdateRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplateResponse> {
    return this.httpClient.post<MessageTemplateResponse>('/message_templates/update', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async publish(
    request: MessageTemplateActionRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplateResponse> {
    return this.httpClient.post<MessageTemplateResponse>('/message_templates/publish', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async archive(
    request: MessageTemplateActionRequest,
    options: RequestOptions = {}
  ): Promise<MessageTemplateResponse> {
    return this.httpClient.post<MessageTemplateResponse>('/message_templates/archive', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: MessageTemplateLookupRequest): Promise<MessageTemplateResponse> {
    return this.httpClient.post<MessageTemplateResponse>('/message_templates/lookup', request);
  }

  async page(request: MessageTemplatePageRequest = {}): Promise<MessageTemplatePageResponse> {
    return this.httpClient.post<MessageTemplatePageResponse>('/message_templates/page', request);
  }

  async renderPreview(
    request: MessageTemplateRenderPreviewRequest
  ): Promise<MessageTemplateRenderPreviewResponse> {
    return this.httpClient.post<MessageTemplateRenderPreviewResponse>(
      '/message_templates/render_preview',
      request
    );
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return { 'Idempotency-Key': key || generateIdempotencyKey() };
}
