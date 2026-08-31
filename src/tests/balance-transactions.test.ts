import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BalanceTransactions } from '../resources/balance-transactions';
import { HttpClient } from '../http-client';
import type {
  BalanceTransaction,
  LookupBalanceTransactionResponse,
} from '../types/balance-transactions';
import type { Payment } from '../types/orders';

describe('BalanceTransactions', () => {
  let balanceTransactions: BalanceTransactions;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    balanceTransactions = new BalanceTransactions(httpClient);
  });

  it('should lookup a balance transaction', async () => {
    const mockResponse: LookupBalanceTransactionResponse = {
      transaction: {
        id: 'bt_123',
        type: 'payment',
        payment_id: 'py_123',
        order_id: 'or_123',
        amount: { currency: 'GHS', value: 2500 },
        created_at: '2026-08-31T12:00:00Z',
      },
    };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balanceTransactions.lookup({ transaction_id: 'bt_123' });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/balance_transactions/lookup', {
      transaction_id: 'bt_123',
    });

    const transaction = result.transaction;
    if (transaction.type === 'payment') {
      expect(transaction.payment_id).toBe('py_123');
      expect(transaction.refund_id).toBeUndefined();
    }
  });

  it('models refund transactions with only their matching strong reference', () => {
    const transaction: BalanceTransaction = {
      id: 'bt_refund',
      type: 'refund',
      refund_id: 'rf_123',
      order_id: 'or_123',
      amount: { currency: 'GHS', value: 500 },
      created_at: '2026-08-31T12:00:00Z',
    };

    if (transaction.type === 'refund') {
      expect(transaction.refund_id).toBe('rf_123');
      expect(transaction.payment_id).toBeUndefined();
    }
  });

  it('reuses the canonical model for order-embedded balance transactions', () => {
    const payment: Payment = {
      balance_transaction: {
        id: 'bt_payment',
        type: 'payment',
        payment_id: 'py_123',
        order_id: 'or_123',
        amount: { currency: 'GHS', value: 2500 },
        created_at: '2026-08-31T12:00:00Z',
      },
    };

    expect(payment.balance_transaction?.type).toBe('payment');
  });

  it('should page balance transactions', async () => {
    const mockResponse = { page: { number: 1, size: 20, transactions: [] } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const result = await balanceTransactions.page({ page_number: 1, page_size: 20 });

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/balance_transactions/page', {
      page_number: 1,
      page_size: 20,
    });
  });

  it('should validate transaction_id for lookup', async () => {
    await expect(balanceTransactions.lookup({} as any)).rejects.toThrow('Validation failed');
  });
});
