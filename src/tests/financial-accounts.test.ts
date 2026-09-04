import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinancialAccounts } from '../resources/financial-accounts';
import { HttpClient } from '../http-client';
import { mockFinancialAccountResponse } from './mocks';

describe('FinancialAccounts', () => {
  let fa: FinancialAccounts;
  let httpClient: HttpClient;
  const owner = {
    name: 'Akua Mensah',
    address: {
      name: 'Akua Mensah',
      line1: '1 Independence Avenue',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'GH',
    },
  };

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    fa = new FinancialAccounts(httpClient);
  });

  it('should create a financial account', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockFinancialAccountResponse);

    const result = await fa.create({
      label: 'My Wallet',
      type: 'wallet',
      reference: 'REF-2024-001',
      currency: 'ghs',
      owner,
      wallet: {
        type: 'mobile_money',
        mobileMoney: { accountNumber: '0241234567', network: 'mtn' },
      },
    });

    expect(result).toEqual(mockFinancialAccountResponse.account);
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/create', expect.any(Object));
  });

  it('should validate required fields on create', async () => {
    await expect(fa.create({} as any)).rejects.toThrow('Validation failed');
  });

  it('should lookup a financial account', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockFinancialAccountResponse);

    const result = await fa.lookup({ accountId: 'fa_123' });

    expect(result).toEqual(mockFinancialAccountResponse.account);
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/lookup', { accountId: 'fa_123' });
  });

  it('should call archive/page/verify/connect/reconnect', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
      ...mockFinancialAccountResponse,
      page: { number: 1, size: 20, accounts: [] },
    });

    await fa.archive({ accountId: 'fa_123' });
    await fa.page({});
    await fa.verify({ accountId: 'fa_123' });
    await fa.disablePush({ accountId: 'fa_123', unsetAsPayoutDestination: true });
    await fa.disconnect({ accountId: 'fa_123', unsetAsPayoutDestination: true });
    await fa.reconnect({ accountId: 'fa_123' });
    await fa.connect({
      label: 'My Wallet',
      type: 'wallet',
      reference: 'REF-2024-001',
      currency: 'ghs',
      owner,
      wallet: {
        type: 'mobile_money',
        mobileMoney: { accountNumber: '0241234567', network: 'mtn' },
      },
    });

    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/archive', { accountId: 'fa_123' });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/page', {});
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/verify', { accountId: 'fa_123' });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/disable_push', {
      accountId: 'fa_123',
      unsetAsPayoutDestination: true,
    });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/disconnect', {
      accountId: 'fa_123',
      unsetAsPayoutDestination: true,
    });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/reconnect', {
      accountId: 'fa_123',
    });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/connect', expect.any(Object));
  });
});
