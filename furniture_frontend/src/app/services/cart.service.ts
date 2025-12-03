import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiBaseUrl } from '../config/app-config';
import { UserContextService } from './user-context.service';

/** Cart item interface for frontend usage */
export interface CartItemDto {
  product_id: number;
  name: string;
  image_url: string | null;
  price: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItemDto[];
  total: number;
}

/**
 * Service for interacting with backend cart endpoints.
 * All methods attach X-User-Id header.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private userCtx = inject(UserContextService);
  private baseUrl = `${getApiBaseUrl()}/cart`;

  // PUBLIC_INTERFACE
  getCart() {
    /** Calls GET /cart for the user's cart. */
    return this.http.get<CartResponse>(this.baseUrl, {
      headers: this.userCtx.getAuthHeaders(),
    });
  }

  // PUBLIC_INTERFACE
  add(productId: number, quantity: number = 1) {
    /** Calls POST /cart/{product_id} with quantity to add. */
    return this.http.post<CartResponse>(
      `${this.baseUrl}/${productId}`,
      { quantity },
      { headers: this.userCtx.getAuthHeaders() }
    );
  }

  // PUBLIC_INTERFACE
  update(productId: number, quantity: number) {
    /** Calls PUT /cart/{product_id} to update quantity. */
    return this.http.put<CartResponse>(
      `${this.baseUrl}/${productId}`,
      { quantity },
      { headers: this.userCtx.getAuthHeaders() }
    );
  }

  // PUBLIC_INTERFACE
  remove(productId: number) {
    /** Calls DELETE /cart/{product_id} to remove item from cart. */
    return this.http.delete<CartResponse>(
      `${this.baseUrl}/${productId}`,
      { headers: this.userCtx.getAuthHeaders() }
    );
  }

  // PUBLIC_INTERFACE
  clear() {
    /** Calls DELETE /cart/clear to remove all cart items. */
    return this.http.delete<CartResponse>(
      `${this.baseUrl}/clear`,
      { headers: this.userCtx.getAuthHeaders() }
    );
  }
}
