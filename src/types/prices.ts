export interface CreatePriceRequest {
  product_id?: string;
  label?: string;
  about?: string;
  currency: string;
  amount: number;
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

export interface PriceResponse {
  price?: Price;
}
