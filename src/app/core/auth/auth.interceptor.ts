import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { AuthService } from '../data/auth-service';

const AUTH_URLS = ['/auth/login', '/auth/refresh'];

export const authInterceptror: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const isAuthUrl = AUTH_URLS.some((url) => req.url.includes(url));

  if (!token || isAuthUrl) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.warn('Unauthorized — token may have expired.');
      } else if (error.status === 403) {
        console.warn('Forbidden — insufficient permissions.');
      }
      throw error;
    }),
  );
};
