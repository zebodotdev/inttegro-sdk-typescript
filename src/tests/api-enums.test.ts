import { describe, expect, it } from 'vitest';
import {
  MobileMoneyNetworks,
  OtpStatuses,
  PaymentNextActionTypes,
  ProductTypes,
  RefundReasons,
  UploadRequestStatuses,
} from '../index';

describe('API enum constants', () => {
  it('exposes the exact wire values through the public package', () => {
    expect(ProductTypes.Digital).toBe('digital');
    expect(MobileMoneyNetworks.Telecel).toBe('telecel');
    expect(PaymentNextActionTypes.Authorize).toBe('authorize');
    expect(RefundReasons.RequestedByCustomer).toBe('requested_by_customer');
    expect(UploadRequestStatuses.Pending).toBe('pending');
    expect(OtpStatuses.PendingVerification).toBe('pending_verification');
  });
});
