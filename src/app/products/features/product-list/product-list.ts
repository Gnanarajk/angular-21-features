import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ProductStore } from '../../data/product-store';
import { CommonModule } from '@angular/common';
import { CdkFixedSizeVirtualScroll, ScrollingModule } from '@angular/cdk/scrolling';
import { HasPermission } from '../../../shared/directives/has-permission';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CdkFixedSizeVirtualScroll, ScrollingModule, HasPermission],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private store = inject(ProductStore);
  searchTerm = signal('');

  constructor() {
    this.store.loadInitial();
  }

  onSearch(query: string) {
    this.searchTerm.set(query);
  }

  onScroll(index: number) {
    if (index >= this.filteredProducts().length - 5 && !this.store.isLoading$()) {
      this.store.loadMore();
    }
  }

  products = this.store.products$;
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter((p) => p.title.toLowerCase().includes(term));
  });

  trackById = (_: number, item: any) => item.id;
}
