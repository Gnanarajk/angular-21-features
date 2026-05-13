import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Order } from '../../models/order.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrderStore } from '../../data-access/order-store';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, CdkVirtualScrollViewport, ScrollingModule, MatSlideToggleModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList {
  private store = inject(OrderStore);
  constructor() {
    this.store.loadInitial();
  }

  orders = this.store.orders$;
  isLoading = this.store.isLoading$;

  trackById = (_: number, item: any) => item.id;
}
