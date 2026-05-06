import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductApi {
  http = inject(HttpClient);

  getProducts(params: { limit: number; skip: number }) {
    const paramsToHttp = new HttpParams()
      .set('limit', params.limit.toString())
      .set('skip', params.skip.toString());

    return this.http
      .get<Product[]>('https://dummyjson.com/products', { params: paramsToHttp })
      .pipe(map((response: any) => response.products as Product[]));
  }
}
