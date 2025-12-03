import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductListResponse, ProductQuery } from '../models/product.model';
import { getApiBaseUrl } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${getApiBaseUrl()}/products`;

  // PUBLIC_INTERFACE
  list(query: ProductQuery) {
    /** Calls GET /products with query params for filters and pagination. */
    let params = new HttpParams();
    if (query.q) params = params.set('q', query.q);
    if (query.category) params = params.set('category', query.category);
    if (query.min_price != null) params = params.set('min_price', String(query.min_price));
    if (query.max_price != null) params = params.set('max_price', String(query.max_price));
    params = params.set('page', String(query.page ?? 1));
    params = params.set('page_size', String(query.page_size ?? 12));
    return this.http.get<ProductListResponse>(this.baseUrl, { params });
  }

  // PUBLIC_INTERFACE
  getById(id: number) {
    /** Calls GET /products/{id} to fetch a single product. */
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
