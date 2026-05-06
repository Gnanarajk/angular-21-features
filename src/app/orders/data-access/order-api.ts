import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderApi {
  constructor() {}
  private http = inject(HttpClient);

  getOrders() {
    return this.http.get<Order[]>('https://dummyjson.com/carts');
  }
}
