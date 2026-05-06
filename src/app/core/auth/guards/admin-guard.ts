import { CanActivateFn, Router } from '@angular/router';
import { authInterceptror } from '../auth.interceptor';
import { AuthService } from '../../data/auth-service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole(); // Replace with actual logic to determine if the user is an admin
  if (userRole === 'admin') {
    return true; // Prevent access to the route
  }
  console.warn('Access denied. User is not an admin.'); // Allow access to the route
  router.navigate(['/']); // Redirect to login page or show an error message
  return false;
};
