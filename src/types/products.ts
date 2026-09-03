import { CustomData, ProductType } from './common';
import type { ProductShipmentInputType, ProductShipmentType } from './api-enums';

export interface ProductPriceAmount {
  currency: string;
  value: number;
}

export interface ProductDefaultUnitPrice {
  id: string;
  active: boolean;
  product_id?: string | null;
  label?: string | null;
  about?: string | null;
  nominal: ProductPriceAmount;
  created_at: string;
  updated_at?: string | null;
  archived_at?: string | null;
}

export interface ProductPriceSummary {
  id: string;
  active: boolean;
  label?: string | null;
  nominal: ProductPriceAmount;
}

export interface ProductPhysicalDimensions {
  weight_unit?: string;
  weight?: number;
  size?: number;
  volume_unit?: string;
  volume?: number;
  length?: number;
  height?: number;
  width?: number;
}

export interface ProductDigitalDimensions {
  bytes?: number;
  size_unit?: string;
  size?: number;
}

export interface ProductCustomDimensions {
  size_unit?: string;
  size?: number;
  details?: Record<string, string>;
}

export type ProductDimensions =
  | { physical: ProductPhysicalDimensions; digital?: never; custom?: never }
  | { physical?: never; digital: ProductDigitalDimensions; custom?: never }
  | { physical?: never; digital?: never; custom: ProductCustomDimensions };

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductShipment {
  type: ProductShipmentType;
  delivery?: Record<string, unknown>;
  download?: Record<string, unknown>;
  render?: Record<string, unknown>;
  service?: Record<string, unknown>;
  stream?: Record<string, unknown>;
}

export interface ProductShipmentInput {
  type: ProductShipmentInputType;
}

export interface ProductMedia {
  hero_image?: string;
  thumbnail?: string;
  web_page_url?: string;
  brand_logo?: string;
  infographic?: string;
  promo_video?: string;
  demo_video?: string;
  gallery?: string[];
  downloads?: string[];
}

export interface CreateProductRequest {
  type: ProductType;
  name: string;
  reference?: string;
  description?: string;
  about?: string;
  tax_code?: string;
  category?: string;
  shipment?: ProductShipmentInput;
  dimensions?: ProductDimensions;
  unit_dimension?: string;
  media?: ProductMedia;
  attributes?: ProductAttribute[];
  publish?: boolean;
  custom_data?: CustomData;
}

export interface LookupProductRequest {
  product_id: string;
}

export interface UpdateProductRequest {
  product_id: string;
  type?: ProductType;
  name?: string;
  description?: string;
  about?: string;
  tax_code?: string;
  category?: string;
  shipment?: ProductShipmentInput;
  dimensions?: ProductDimensions;
  unit_dimension?: string;
  media?: ProductMedia;
  images?: string[];
  attributes?: ProductAttribute[];
  custom_data?: CustomData;
}

export interface ProductActionRequest {
  product_id: string;
}

export interface AddProductPriceRequest {
  product_id: string;
  amount: ProductPriceAmount;
  label?: string;
  about?: string;
}

export interface SetDefaultUnitPriceRequest {
  product_id: string;
  price_id: string;
}

export interface PageProductsRequest {
  page_number?: number;
  page_size?: number;
}

export interface Product {
  id: string;
  application_id?: string;
  type: ProductType;
  reference?: string | null;
  name: string;
  description?: string | null;
  about?: string | null;
  tax_code?: string | null;
  category?: string | null;
  prices?: ProductPriceSummary[] | null;
  shipment?: ProductShipment | null;
  media?: ProductMedia | null;
  attributes?: ProductAttribute[] | null;
  dimensions?: ProductDimensions | null;
  custom_data?: CustomData | null;
  active: boolean;
  created_at: string;
  updated_at?: string | null;
  archived_at?: string | null;
  published_at?: string | null;
  unit_dim?: string | null;
}

export interface ProductPage {
  number?: number;
  size?: number;
  products?: Product[];
}
