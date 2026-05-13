import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { AuthResponse, CurrentUser, LoginRequest, RefreshResponse } from '../auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly loginUrl = 'https://dummyjson.com/auth/login';
  private readonly refreshUrl = 'https://dummyjson.com/auth/refresh';
  private readonly meUrl = 'https://dummyjson.com/auth/me';
  private readonly REFRESH_COOKIE = 'rt';

  private _token = signal<string | null>(null);
  private _currentUser = signal<CurrentUser | null>(null);

  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  isAuthenticated(): boolean {
    return this._token() !== null;
  }

  getToken(): string | null {
    return this._token();
  }

  login(username: string, password: string) {
    const body: LoginRequest = { username, password, expiresInMins: 60 };
    return this.http
      .post<AuthResponse>(this.loginUrl, body, { withCredentials: true })
      .pipe(
        tap((response) => {
          this._token.set(response.accessToken);
          this._currentUser.set({
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
            role: response.role,
          });
          // Persist refresh token in a cookie so it survives page reloads
          this.setRefreshCookie(response.refreshToken);
        }),
      );
  }

  // Called by APP_INITIALIZER on every page load.
  // Reads the refresh token from the cookie and silently restores the session.
  // Always resolves so the app bootstraps regardless of outcome.
  tryRefreshOnInit(): Promise<void> {
    const refreshToken = this.getRefreshCookie();
    if (!refreshToken) return Promise.resolve();

    return firstValueFrom(
      this.http
        .post<RefreshResponse>(
          this.refreshUrl,
          { refreshToken, expiresInMins: 30 },
          { withCredentials: true },
        )
        .pipe(
          tap((response) => {
            this._token.set(response.accessToken);
            this.setRefreshCookie(response.refreshToken); // rotate the cookie
          }),
          switchMap(() => this.http.get<CurrentUser>(this.meUrl)),
          tap((user) => this._currentUser.set(user)),
          catchError(() => {
            this.clearRefreshCookie(); // stale or invalid — clear it
            return of(null);
          }),
        ),
    ).then(() => void 0);
  }

  logout(): void {
    this._token.set(null);
    this._currentUser.set(null);
    this.clearRefreshCookie();
    this.router.navigate(['/login']);
  }

  // ── cookie helpers ────────────────────────────────────────────────────────

  private setRefreshCookie(token: string): void {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `${this.REFRESH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict`;
  }

  private getRefreshCookie(): string | null {
    const match = document.cookie.match(`(?:^|;\\s*)${this.REFRESH_COOKIE}=([^;]*)`);
    return match ? decodeURIComponent(match[1]) : null;
  }

  private clearRefreshCookie(): void {
    document.cookie = `${this.REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
  }
}
