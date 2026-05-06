import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './users/data/users.store';
import { UsersEffects } from './users/data/users.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptror } from './core/auth/auth.interceptor';
import { AuthService } from './core/data/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.login();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideStore({ users: usersReducer }),
    provideEffects(UsersEffects),
    provideHttpClient(withInterceptors([authInterceptror])),
  ],
};
