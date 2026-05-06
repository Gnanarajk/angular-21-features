import { Injectable, signal } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderApi } from './order-api';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStore {
  private _orders = signal<Order[]>([]);
  private _isLoading = signal(false);

  orders$ = this._orders.asReadonly();
  isLoading$ = this._isLoading.asReadonly();

  constructor(private api: OrderApi) {}

  loadInitial() {
    this.fetchOrders();
  }

  private fetchOrders() {
    this._isLoading.set(true);
    this.api
      .getOrders()
      .pipe(map((response: any) => response.carts as Order[]))
      .subscribe({
        next: (orders: Order[]) => {
          this._orders.update((prev) => [...prev, ...orders]);
          this._isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this._isLoading.set(false);
        },
      });

    // this._orders.set(
    //   Array.from({ length: 1000 }).map((_, i) => ({
    //     id: i,
    //     userId: i,
    //     total: Math.random() * 100,
    //     totalProducts: Math.floor(Math.random() * 10),
    //     totalQuantity: Math.floor(Math.random() * 50),
    //     discountedTotal: Math.random() * 100,
    //     products: [],
    //   })),
    //);
    this._isLoading.set(false);
  }
}
