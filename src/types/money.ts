/** Currency codes accepted by amount-bearing API fields. */
export const Currencies = {
  GHS: 'ghs',
  USD: 'usd',
  GBP: 'gbp',
  EUR: 'eur',
  CNY: 'cny',
} as const;

export type Currency = (typeof Currencies)[keyof typeof Currencies];

/** An amount supplied in an API request, in the currency's smallest unit. */
export interface AmountParams {
  currency: Currency;
  value: number;
}

/** An amount returned by the API, in the currency's smallest unit. */
export interface Amount {
  currency: Currency;
  value: number;
}
