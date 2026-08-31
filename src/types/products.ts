import { CustomData, ProductType } from './common';
import type { ProductShipmentInputType, ProductShipmentType } from './api-enums';

export interface ProductCategory {
  id?: string;
  name?: string;
  slug?: string;
}

export interface ProductPrice {
  amount: number;
  currency: string;
}

export interface ProductPriceAmount {
  currency: string;
  value: number;
}

export interface ProductDefaultUnitPrice {
  id: string;
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
  label?: string | null;
  nominal: ProductPriceAmount;
}

export interface ProductShipmentDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

export interface ProductShipment {
  type?: ProductShipmentType;
  carrier?: string;
  dimensions?: ProductShipmentDimensions;
}

export interface ProductShipmentInput extends Omit<ProductShipment, 'type'> {
  type?: ProductShipmentInputType;
}

export interface ProductMediaItem {
  url?: string;
  type?: 'image' | 'video';
}

export interface CreateProductRequest {
  type: ProductType;
  name: string;
  price?: ProductPrice;
  reference?: string;
  description?: string;
  about?: string;
  tax_code?: string;
  category?: ProductCategory;
  shipment?: ProductShipmentInput;
  media?: ProductMediaItem[];
  attributes?: Record<string, string>;
  custom_data?: CustomData;
}

export interface LookupProductRequest {
  product_id: string;
}

export interface UpdateProductRequest {
  product_id: string;
  reference?: string;
  name?: string;
  description?: string;
  about?: string;
  tax_code?: string;
  category?: ProductCategory;
  price?: ProductPrice;
  shipment?: ProductShipmentInput;
  media?: ProductMediaItem[];
  attributes?: Record<string, string>;
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
  set_as_default?: boolean;
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
  category?: ProductCategory | null;
  price?: ProductPrice | null;
  default_unit_price?: ProductDefaultUnitPrice | null;
  prices?: ProductPriceSummary[] | null;
  shipment?: ProductShipment | null;
  media?: ProductMediaItem[] | null;
  attributes?: Record<string, string> | null;
  custom_data?: CustomData | null;
  active: boolean;
  archived: boolean;
  created_at: string;
  updated_at?: string | null;
  archived_at?: string | null;
}

export interface ProductResponse {
  product?: Product;
}

export interface AddProductPriceResponse {
  price?: ProductDefaultUnitPrice;
}

export interface ProductPage {
  number?: number;
  size?: number;
  products?: Product[];
}

export interface PageProductsResponse {
  page?: ProductPage;
}
