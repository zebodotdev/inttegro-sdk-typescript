import { describe, expect, it } from 'vitest';
import {
  Currencies,
  MobileMoneyNetworks,
  OtpStatuses,
  PaymentNextActionTypes,
  PaymentStatuses,
  ProductTypes,
  RefundReasons,
  UploadRequestStatuses,
} from '../index';
import type { CatalogPrice, CatalogPriceParams, PriceParams } from '../index';

describe('domain constants', () => {
  it('exposes exact wire values through the public package', () => {
    expect(ProductTypes.Digital).toBe('digital');
    expect(Currencies.GHS).toBe('ghs');
    expect(MobileMoneyNetworks.MTN).toBe('mtn');
    expect(MobileMoneyNetworks.Telecel).toBe('telecel');
    expect(PaymentNextActionTypes.Authorize).toBe('authorize');
    expect(PaymentStatuses.RequiresAction).toBe('requires_action');
    expect(RefundReasons.RequestedByCustomer).toBe('requested_by_customer');
    expect(UploadRequestStatuses.Pending).toBe('pending');
    expect(OtpStatuses.PendingVerification).toBe('pending_verification');
  });

  it('keeps inline prices flat and catalog price amounts nested', () => {
    const price: PriceParams = { currency: Currencies.GHS, value: 3005 };
    const catalogPrice: CatalogPriceParams = { amount: price, label: 'Retail' };

    expect(JSON.stringify(price)).toBe('{"currency":"ghs","value":3005}');
    expect(catalogPrice).toEqual({ amount: price, label: 'Retail' });

    const returned: CatalogPrice = {
      id: 'pr_123',
      active: true,
      nominal: price,
      product_id: 'prod_123',
      created_at: '2026-09-02T12:00:00Z',
    };
    expect(returned.product_id).toBe('prod_123');
  });
});
