import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { Refunds } from '../resources/refunds';

describe('Refunds', () => {
  let refunds: Refunds;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    refunds = new Refunds(httpClient);
  });

  it('should create, cancel, look up, and page refunds', async () => {
    const response = { refund: { id: 'rf_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(response);

    await refunds.create(
      {
        line_items: [
          {
            order_line_item_id: 'oli_123',
            refund_amount: { currency: 'ghs', value: 2500 },
          },
        ],
        order_id: 'or_123',
        reason: 'requested_by_customer',
      },
      { idempotencyKey: 'idem_refund_create' }
    );
    await refunds.cancel({ refund_id: 'rf_123' }, { idempotencyKey: 'idem_refund_cancel' });
    await refunds.lookup({ refund_id: 'rf_123' });
    await refunds.page({ page_number: 1, page_size: 20 });

    expect(postSpy).toHaveBeenCalledWith('/refunds/create', expect.any(Object), {
      headers: { 'Idempotency-Key': 'idem_refund_create' },
    });
    expect(postSpy).toHaveBeenCalledWith(
      '/refunds/cancel',
      { refund_id: 'rf_123' },
      { headers: { 'Idempotency-Key': 'idem_refund_cancel' } }
    );
    expect(postSpy).toHaveBeenCalledWith('/refunds/lookup', { refund_id: 'rf_123' });
    expect(postSpy).toHaveBeenCalledWith('/refunds/page', { page_number: 1, page_size: 20 });
  });
});
