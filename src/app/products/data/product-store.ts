import { Injectable, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductApi } from './product-api';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private _products = signal<Product[]>([]);
  private _isLoading = signal(false);
  private paramItems = signal({ limit: 100, skip: 0 });

  products$ = this._products.asReadonly();
  isLoading$ = this._isLoading.asReadonly();

  constructor(private api: ProductApi) {}

  loadInitial() {
    this.fetchProducts();
  }

  loadMore() {
    if (!this._isLoading()) {
      this.paramItems.update((p) => ({ ...p, skip: p.skip + 10 }));
      this.fetchProducts();
    }
  }

  private fetchProducts() {
    this._isLoading.set(true);
    this.api.getProducts(this.paramItems()).subscribe({
      next: (products: Product[]) => {
        this._products.update((prev) => [...prev, ...products]);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this._isLoading.set(false);
      },
    });
  }
}
