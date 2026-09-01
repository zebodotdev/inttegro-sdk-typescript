import { HttpClient } from '../http-client';
import {
  CancelRefundRequest,
  CreateRefundRequest,
  LookupRefundRequest,
  PageRefundsRequest,
  RefundPageResponse,
  RefundResponse,
  RequestOptions,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class Refunds {
  constructor(private httpClient: HttpClient) {}

  async create(
    request: CreateRefundRequest,
    options: RequestOptions = {}
  ): Promise<RefundResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'line_items',
      'order_id',
      'reason',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RefundResponse>('/refunds/create', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async cancel(
    request: CancelRefundRequest,
    options: RequestOptions = {}
  ): Promise<RefundResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['refund_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RefundResponse>('/refunds/cancel', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: LookupRefundRequest): Promise<RefundResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['refund_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RefundResponse>('/refunds/lookup', request);
  }

  async page(request: PageRefundsRequest): Promise<RefundPageResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['page_number']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<RefundPageResponse>('/refunds/page', request);
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
