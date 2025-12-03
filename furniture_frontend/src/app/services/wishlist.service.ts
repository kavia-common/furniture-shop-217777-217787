import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getApiBaseUrl } from '../config/app-config';
import { WishlistResponse } from '../models/wishlist.model';
import { UserContextService } from './user-context.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private http = inject(HttpClient);
  private userCtx = inject(UserContextService);
  private baseUrl = `${getApiBaseUrl()}/wishlist`;

  // PUBLIC_INTERFACE
  getWishlist() {
    /** Calls GET /wishlist and returns the list of products. */
    return this.http.get<WishlistResponse>(this.baseUrl, {
      headers: this.userCtx.getAuthHeaders(),
    });
  }

  // PUBLIC_INTERFACE
  add(productId: number) {
    /** Calls POST /wishlist/{id} to add product to wishlist. */
    return this.http.post<void>(`${this.baseUrl}/${productId}`, null, {
      headers: this.userCtx.getAuthHeaders(),
    });
  }

  // PUBLIC_INTERFACE
  remove(productId: number) {
    /** Calls DELETE /wishlist/{id} to remove product from wishlist. */
    return this.http.delete<void>(`${this.baseUrl}/${productId}`, {
      headers: this.userCtx.getAuthHeaders(),
    });
  }
}
