import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';

export interface Shipment {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private http = inject(HttpClient);

  getShipments(query: string = '') {
    const params = new HttpParams().set('q', query);
    if (!query) {
      return this.http
        .get('https://dummyjson.com/posts')
        .pipe(map((response: any) => response.posts as Shipment[]));
    }
    return this.http
      .get('https://dummyjson.com/posts/search', { params })
      .pipe(map((response: any) => response.posts as Shipment[]));
  }

  deleteShipment(id: number) {
    return this.http.delete(`https://dummyjson.com/posts/${id}`);
  }
}
