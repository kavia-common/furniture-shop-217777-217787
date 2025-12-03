import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  items = signal<any[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.cartService.getCart().subscribe({
      next: res => {
        this.items.set(res.items ?? []);
        this.total.set(res.total ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cart');
        this.items.set([]);
        this.total.set(0);
        this.loading.set(false);
      }
    });
  }

  updateQty(item: any, evt: any) {
    let qty = 1;
    // SSR-safe: Only try to access event and input if available.
    if (evt && typeof evt === 'object' && 'target' in evt && evt.target && typeof evt.target.value !== 'undefined') {
      qty = Number(evt.target.value);
    }
    if (qty < 1) return;
    this.cartService.update(item.product_id, qty).subscribe({
      next: res => {
        this.items.set(res.items ?? []);
        this.total.set(res.total ?? 0);
      }
    });
  }

  remove(item: any) {
    this.cartService.remove(item.product_id).subscribe({
      next: res => {
        this.items.set(res.items ?? []);
        this.total.set(res.total ?? 0);
      }
    });
  }

  clear() {
    // SSR-safe: Only run confirm if in browser
    const g = typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    if (g && typeof g.confirm === 'function') {
      if (!g.confirm('Clear your cart?')) return;
    }
    this.cartService.clear().subscribe({
      next: () => this.refresh()
    });
  }
}
