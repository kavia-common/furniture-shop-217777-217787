import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { getTheme } from '../../config/app-config';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);

  theme = getTheme();
  product = signal<Product | null>(null);
  loading = signal(true);
  notFound = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.add(p.id, 1).subscribe({
      next: () => {
        // update global cart badge (only in browser)
        const g = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
        const rootApp = g?.['rootAppComponent'] as AppComponent | undefined;
        if (rootApp && typeof rootApp.getCartCount === 'function') {
          rootApp.getCartCount();
        }
      },
      error: (e) => console.error('Failed to add to cart', e)
    });
  }

  addToWishlist() {
    const p = this.product();
    if (!p) return;
    this.wishlistService.add(p.id).subscribe({
      next: () => {},
      error: (e) => console.error('Failed to add to wishlist', e)
    });
  }
}
