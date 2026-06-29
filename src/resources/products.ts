import { HttpClient } from '../http-client';
import {
  AddProductPriceRequest,
  AddProductPriceResponse,
  CreateProductRequest,
  LookupProductRequest,
  PageProductsRequest,
  PageProductsResponse,
  ProductActionRequest,
  ProductResponse,
  SetDefaultUnitPriceRequest,
  UpdateProductRequest,
} from '../types';
import { throwIfValidationErrors, validateRequired } from '../utils/validation';

/**
 * Products resource for managing catalog items
 */
export class Products {
  constructor(private httpClient: HttpClient) {}

  async create(request: CreateProductRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'type',
      'name',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/create', request);
  }

  async addPrice(request: AddProductPriceRequest): Promise<AddProductPriceResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'product_id',
      'amount',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<AddProductPriceResponse>('/products/add_price', request);
  }

  async setDefaultUnitPrice(request: SetDefaultUnitPriceRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, [
      'product_id',
      'price_id',
    ]);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/set_default_unit_price', request);
  }

  async lookup(request: LookupProductRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['product_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/lookup', request);
  }

  async update(request: UpdateProductRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['product_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/update', request);
  }

  async publish(request: ProductActionRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['product_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/publish', request);
  }

  async unpublish(request: ProductActionRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['product_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/unpublish', request);
  }

  async archive(request: ProductActionRequest): Promise<ProductResponse> {
    const errors = validateRequired(request as unknown as Record<string, unknown>, ['product_id']);
    throwIfValidationErrors(errors);

    return this.httpClient.post<ProductResponse>('/products/archive', request);
  }

  async page(request: PageProductsRequest = {}): Promise<PageProductsResponse> {
    return this.httpClient.post<PageProductsResponse>('/products/page', request);
  }
}
