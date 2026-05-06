import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class UsersApi {
  private http = inject(HttpClient);

  getUsers() {
    return this.http
      .get('https://dummyjson.com/users')
      .pipe(map((response: any) => response.users));
  }

  getUser(id: string | number) {
    return this.http.get(`https://dummyjson.com/users/${id}`);
  }
}
