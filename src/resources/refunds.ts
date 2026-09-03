import { HttpClient } from '../http-client';
import {
  CancelRefundRequest,
  CreateRefundRequest,
  LookupRefundRequest,
  PageRefundsRequest,
  Refund,
  RefundPage,
  RequestOptions,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

export class Refunds {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreateRefundRequest, options: RequestOptions = {}): Promise<Refund> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'line_items',
      'order_id',
      'reason',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Refund>('/refunds/create', 'refund', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async cancel(request: CancelRefundRequest, options: RequestOptions = {}): Promise<Refund> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['refund_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Refund>('/refunds/cancel', 'refund', request, {
      headers: idempotencyHeaders(options.idempotencyKey),
    });
  }

  async lookup(request: LookupRefundRequest): Promise<Refund> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['refund_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<Refund>('/refunds/lookup', 'refund', request);
  }

  async page(request: PageRefundsRequest): Promise<RefundPage> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['page_number']);
    throwIfValidationErrors(errors);

    return this.httpClient.postResource<RefundPage>('/refunds/page', 'page', request);
  }
}

function idempotencyHeaders(key?: string): Record<string, string> {
  return key ? { 'Idempotency-Key': key } : {};
}
