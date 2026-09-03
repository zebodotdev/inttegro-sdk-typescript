import type { Amount, AmountParams } from './money';
import type { Product } from './products';

/** An inline price supplied in a request. */
export interface PriceParams extends AmountParams {}

/** An inline price returned by the API. */
export interface Price extends Amount {}

/** Parameters for creating a stored catalog price. */
export interface CatalogPriceParams {
  product_id?: string;
  label?: string;
  about?: string;
  amount: AmountParams;
}

export interface LookupPriceRequest {
  price_id: string;
}

export interface UpdatePriceRequest {
  price_id: string;
  product_id?: string;
  label?: string;
  about?: string;
}

export interface PriceActionRequest {
  price_id: string;
}

export interface PagePricesRequest {
  page_number?: number;
  page_size?: number;
  product_id?: string;
}

export interface CatalogPrice {
  id: string;
  label?: string | null;
  about?: string | null;
  active: boolean;
  nominal: Amount;
  product?: Product | null;
  created_at: string;
  updated_at?: string | null;
  archived_at?: string | null;
}

export interface PricePage {
  number?: number;
  size?: number;
  prices?: CatalogPrice[];
}
