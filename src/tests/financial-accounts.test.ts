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
      line_1: '1 Independence Avenue',
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
        mobile_money: { account_number: '0241234567', network: 'mtn' },
      },
    });

    expect(result).toEqual(mockFinancialAccountResponse);
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/create', expect.any(Object));
  });

  it('should validate required fields on create', async () => {
    await expect(fa.create({} as any)).rejects.toThrow('Validation failed');
  });

  it('should lookup a financial account', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockFinancialAccountResponse);

    const result = await fa.lookup({ account_id: 'fa_123' });

    expect(result).toEqual(mockFinancialAccountResponse);
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/lookup', { account_id: 'fa_123' });
  });

  it('should call archive/page/verify/connect', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockFinancialAccountResponse);

    await fa.archive({ account_id: 'fa_123' });
    await fa.page({});
    await fa.verify({ account_id: 'fa_123' });
    await fa.disablePush({ account_id: 'fa_123', unset_as_payout_destination: true });
    await fa.disconnect({ account_id: 'fa_123', unset_as_payout_destination: true });
    await fa.connect({
      label: 'My Wallet',
      type: 'wallet',
      reference: 'REF-2024-001',
      currency: 'ghs',
      owner,
      wallet: {
        type: 'mobile_money',
        mobile_money: { account_number: '0241234567', network: 'mtn' },
      },
    });

    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/archive', { account_id: 'fa_123' });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/page', {});
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/verify', { account_id: 'fa_123' });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/disable_push', {
      account_id: 'fa_123',
      unset_as_payout_destination: true,
    });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/disconnect', {
      account_id: 'fa_123',
      unset_as_payout_destination: true,
    });
    expect(postSpy).toHaveBeenCalledWith('/financial_accounts/connect', expect.any(Object));
  });
});
