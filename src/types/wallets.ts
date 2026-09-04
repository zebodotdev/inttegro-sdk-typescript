import type { MobileMoneyNetwork } from './payment-methods';

export const WalletTypes = { MobileMoney: 'mobile_money' } as const;
export type WalletType = (typeof WalletTypes)[keyof typeof WalletTypes];

export interface WalletMobileMoney {
  id?: string;
  accountNumber: string;
  network: MobileMoneyNetwork;
}

export interface WalletConfig {
  type: WalletType;
  mobileMoney?: WalletMobileMoney;
}
