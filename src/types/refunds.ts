import type { RefundReason, RefundStatus } from './api-enums';
import type { RequestMeta } from './common';

export interface RefundMoney {
  currency: string;
  value: number;
}

export interface CreateRefundLineItem {
  order_line_item_id: string;
  refund_amount: RefundMoney;
  reason?: RefundReason;
  reason_details?: string;
}

export interface CreateRefundRequest {
  line_items: CreateRefundLineItem[];
  order_id: string;
  reason: RefundReason;
  custom_data?: Record<string, string>;
  reason_details?: string;
  reference?: string;
  request_meta?: RequestMeta;
}

export interface CancelRefundRequest {
  refund_id: string;
  request_meta?: RequestMeta;
}

export interface LookupRefundRequest {
  refund_id: string;
}

export interface PageRefundsRequest {
  page_number: number;
  page_size?: number;
}

export interface RefundLineItem {
  id: string;
  order_line_item_id: string;
  original_amount_paid: RefundMoney;
  refund_amount: RefundMoney;
  reason?: RefundReason;
  reason_details?: string;
}

export interface Refund {
  created_at: string;
  id: string;
  line_items: RefundLineItem[];
  order_id: string;
  reason: RefundReason;
  status: RefundStatus;
  total: RefundMoney;
  canceled_at?: string;
  custom_data?: Record<string, string>;
  failed_at?: string;
  processing_at?: string;
  reason_details?: string;
  reference?: string;
  succeeded_at?: string;
}

export interface RefundResponse {
  refund: Refund;
}

export interface RefundPageResponse {
  page: {
    number: number;
    refunds: Refund[];
    size: number;
  };
}
