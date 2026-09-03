export interface PriceAmount {
  currency: string;
  value: number;
}

export interface CreatePriceRequest {
  product_id?: string;
  label?: string;
  about?: string;
  amount: PriceAmount;
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

export interface PriceNominal {
  currency: string;
  value: number;
  sign: number;
}

export interface Price {
  id: string;
  product_id?: string | null;
  label?: string | null;
  about?: string | null;
  nominal: PriceNominal;
  created_at: string;
  updated_at?: string | null;
  archived_at?: string | null;
}

export interface PricePage {
  number?: number;
  size?: number;
  prices?: Price[];
}
