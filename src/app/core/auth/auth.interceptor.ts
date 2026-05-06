import { HttpInterceptor, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../data/auth-service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const authInterceptror: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authToken = authService.getToken();

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(authReq).pipe(
    // Optionally, you can add error handling here
    catchError((error) => {
      if (error.status === 401) {
        // Handle unauthorized error, e.g., redirect to login or refresh token
        console.warn('Unauthorized request - perhaps redirect to login?');
      } else if (error.status === 403) {
        // Handle forbidden error, e.g., show a message to the user
        console.warn('Forbidden request - you do not have permission to access this resource.');
      }
      // Handle the error as needed, e.g., log it or show a notification
      console.error('HTTP Error:', error);
      throw error; // Rethrow the error after handling
    }),
  );
};
