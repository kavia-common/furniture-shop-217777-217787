import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductListResponse } from '../../models/product.model';
import { getTheme } from '../../config/app-config';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  theme = getTheme();

  products = signal<Product[]>([]);
  total = signal(0);
  page = signal(1);
  pageSize = signal(12);

  // filter backing fields for template binding
  qVal = '';
  categoryVal = '';
  minPriceVal: number | null = null;
  maxPriceVal: number | null = null;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.productService.list({
      q: this.qVal || undefined,
      category: this.categoryVal || undefined,
      min_price: this.minPriceVal == null ? undefined : this.minPriceVal,
      max_price: this.maxPriceVal == null ? undefined : this.maxPriceVal,
      page: this.page(),
      page_size: this.pageSize(),
    }).subscribe({
      next: (res: ProductListResponse) => {
        this.products.set(res.items);
        this.total.set(res.total);
        this.page.set(res.page);
        this.pageSize.set(res.page_size);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.products.set([]);
        this.total.set(0);
      }
    });
  }

  applyFilters() {
    this.page.set(1);
    this.fetch();
  }

  clearFilters() {
    this.qVal = '';
    this.categoryVal = '';
    this.minPriceVal = null;
    this.maxPriceVal = null;
    this.applyFilters();
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.fetch();
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
      this.fetch();
    }
  }

  openDetail(p: Product) {
    this.router.navigate(['/products', p.id]);
  }
}
