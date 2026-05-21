import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';
import { adminGuard } from './core/auth/guards/admin-guard';

/**
 * Route architecture:
 *
 *  /login          → Login component (standalone, no shell — full-screen layout)
 *  / (shell)       → Shell layout (Nav + main + Footer)
 *    /shipments    → guarded by authGuard
 *    /orders       → guarded by authGuard
 *    /products     → guarded by adminGuard
 *    /users        → guarded by authGuard, lazy-loaded child routes
 *    /percent-calc → public tool
 *    /temp-convertor → public tool
 *    /loan-eligibility → public tool
 *
 * Keeping login outside the Shell means it gets its own full-screen canvas.
 * All other pages automatically inherit the sticky header and footer.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ── Public auth page — outside the shell layout ──────────
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },

  // ── Shell layout — wraps all app pages ───────────────────
  {
    path: '',
    loadComponent: () => import('./core/layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'shipments',
        loadComponent: () =>
          import('./shipments/features/shipment-search/shipment-search').then(
            (m) => m.ShipmentSearch,
          ),
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/features/order-list/order-list').then((m) => m.OrderList),
        canActivate: [authGuard],
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/features/product-list/product-list').then((m) => m.ProductList),
        canActivate: [adminGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then((m) => m.usersRoute),
        canActivate: [authGuard],
      },
      // Public utility tools — no guard needed
      {
        path: 'percent-calc',
        loadComponent: () =>
          import('./form-domain/percent-calc/percent-calc').then((m) => m.PercentCalc),
      },
      {
        path: 'temp-convertor',
        loadComponent: () =>
          import('./form-domain/temp-convertor/temp-convertor').then((m) => m.TempConvertor),
      },
      {
        path: 'loan-eligibility',
        loadComponent: () =>
          import('./form-domain/loan-eligibility/loan-eligibility').then(
            (m) => m.LoanEligibility,
          ),
      },
    ],
  },
];
