import type { MobileMoneyNetwork } from './payment-methods';

export const WalletTypes = { MobileMoney: 'mobile_money' } as const;
export type WalletType = (typeof WalletTypes)[keyof typeof WalletTypes];

export interface WalletMobileMoney {
  id?: string;
  account_number: string;
  network: MobileMoneyNetwork;
}

export interface WalletConfig {
  type: WalletType;
  mobile_money?: WalletMobileMoney;
}
