import type { MoneyAmount } from './common';
import type { Product, ProductPriceSummary } from './products';

export type PurchaseIntentStatus = 'active' | 'expired' | 'inactive' | 'used';
export type PurchaseIntentActivityType =
  | 'viewed'
  | 'expired_viewed'
  | 'payment_started'
  | 'order_created'
  | 'payment_failed';

export interface PurchaseIntentProductSelector {
  id: string;
  variant_set_id?: string;
}

export interface PurchaseIntentPriceAmount {
  currency: string;
  value: number;
}

export interface PurchaseIntentPriceSelector {
  id?: string;
  nominal?: PurchaseIntentPriceAmount;
  original?: {
    id?: string;
    nominal?: PurchaseIntentPriceAmount;
  };
  original_id?: string;
}

export interface PurchaseIntentQuantity {
  min: number;
  max?: number;
}

export interface PurchaseIntentUsage {
  single_use?: boolean;
  multi_use?: boolean;
}

interface CreatePurchaseIntentBase {
  quantity: PurchaseIntentQuantity;
  usage?: PurchaseIntentUsage;
  expires_at?: string;
}

type PurchaseIntentProductSelection =
  | {
      product: PurchaseIntentProductSelector;
      product_id?: never;
    }
  | {
      product_id: string;
      product?: never;
    };

type PurchaseIntentPriceSelection =
  | {
      price: PurchaseIntentPriceSelector;
      price_id?: never;
    }
  | {
      price_id: string;
      price?: never;
    };

export type CreatePurchaseIntentRequest = CreatePurchaseIntentBase &
  PurchaseIntentProductSelection &
  PurchaseIntentPriceSelection;

export interface UpdatePurchaseIntentRequest {
  id: string;
  quantity?: PurchaseIntentQuantity;
  expires_at?: string | null;
  reactivate?: boolean;
}

export interface CancelPurchaseIntentRequest {
  id: string;
}

export interface LookupPurchaseIntentRequest {
  id: string;
}

export interface PagePurchaseIntentsRequest {
  page_number: number;
  page_size: number;
}

export interface PurchaseIntentActivityAttribution {
  landing_url?: string;
  referrer?: string;
  referrer_host?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  channel?: string;
}

export interface PurchaseIntentActivityVisitor {
  session_id?: string;
  visitor_id?: string;
  user_agent?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export interface PurchaseIntentActivity {
  id?: string;
  purchase_intent_id?: string;
  type?: PurchaseIntentActivityType;
  source?: string;
  attribution?: PurchaseIntentActivityAttribution;
  visitor?: PurchaseIntentActivityVisitor;
  product_id?: string;
  variant_product_id?: string;
  quantity?: number;
  amount?: MoneyAmount;
  order_id?: string;
  payment_id?: string;
  error_code?: string;
  created_at?: string;
}

export interface PurchaseIntentActivityLog {
  recent?: PurchaseIntentActivity[];
}

export interface PurchaseIntent {
  id: string;
  application_id: string;
  product_id: string;
  price_id: string;
  quantity: PurchaseIntentQuantity;
  adjustable_quantity: boolean;
  allow_variants: boolean;
  status: PurchaseIntentStatus;
  created_at: string;
  updated_at?: string | null;
  activity?: PurchaseIntentActivityLog;
  product?: Product;
  price?: ProductPriceSummary;
}

export interface PurchaseIntentPage {
  number?: number;
  size?: number;
  purchase_intents?: PurchaseIntent[];
}
