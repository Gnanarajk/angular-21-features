import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/user/login';
  private token = signal<string | null>(null);
  private userRole = signal<string | null>(null);

  login() {
    const loginData = { username: 'emilys', password: 'emilyspass' };
    this.http
      .post(this.apiUrl, loginData)
      .pipe(
        tap((response: any) => {
          this.token.set(response.accessToken);
        }),
        switchMap(() => {
          // Optionally, you can perform additional actions after login, such as fetching user details
          return this.http.get('https://dummyjson.com/users/1'); // Example API call after login
        }),
      )
      .subscribe({
        next: (userData: any) => {
          this.userRole.set(userData.role);
        },
      });
  }

  getToken() {
    return this.token();
  }

  getUserRole() {
    return this.userRole();
  }

  logout(): void {
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return this.token() !== null;
  }
}
