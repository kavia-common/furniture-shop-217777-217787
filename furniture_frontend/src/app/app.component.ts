import { Component, OnInit, inject, PLATFORM_ID, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { getTheme } from './config/app-config';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Furniture Shop';
  private platformId = inject(PLATFORM_ID);

  // Mutable signal for global cart count badge (can use .set)
  cartCount: Signal<number> = signal(0);
  private cartService = inject(CartService);

  ngOnInit(): void {
    const theme = getTheme();
    // Use SSR/browser-safe globalThis access
    const g = typeof globalThis !== 'undefined' ? (globalThis as any) : undefined;
    const doc = g?.document ?? undefined;
    if (isPlatformBrowser(this.platformId) && doc?.body) {
      doc.body.style.backgroundColor = theme.background;
      doc.body.style.color = theme.text;
      // SSR-safe: Make AppComponent available globally (for browser only!)
      g['rootAppComponent'] = this;
    }
    this.getCartCount();
  }

  // PUBLIC_INTERFACE
  getCartCount(): void {
    // Safe signal update for badge
    this.cartService.getCart().subscribe({
      next: (res) => {
        const val = res.items ? res.items.reduce((acc, i) => acc + (i.quantity || 0), 0) : 0;
        (this.cartCount as any).set(val);
      },
      error: () => (this.cartCount as any).set(0)
    });
  }
}
