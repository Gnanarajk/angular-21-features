import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptror } from './core/auth/auth.interceptor';
import { AuthService } from './core/data/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideAppInitializer(() => {
    //   const authService = inject(AuthService);
    //   return authService.login();
    // }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    //provideHttpClient(withInterceptors([authInterceptror])),
  ],
};
