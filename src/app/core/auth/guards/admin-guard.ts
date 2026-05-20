import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../data/auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.userRole() === 'admin') {
    return true;
  }

  console.warn('Access denied — admin role required.');
  return router.createUrlTree(['/']);
};
