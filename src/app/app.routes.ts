import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/guards/admin-guard';
import { TempConvertor } from './form-domain/temp-convertor/temp-convertor';
import { LoanEligibility } from './form-domain/loan-eligibility/loan-eligibility';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'loan-eligibility',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/features/order-list/order-list').then((m) => m.OrderList),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/features/product-list/product-list').then((m) => m.ProductList),
    canActivate: [adminGuard],
  },
  {
    path: 'shipments',
    loadComponent: () =>
      import('./shipments/features/shipment-search/shipment-search').then((m) => m.ShipmentSearch),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then((m) => m.usersRoute),
  },
  {
    path: 'percent-calc',
    loadComponent: () =>
      import('./form-domain/percent-calc/percent-calc').then((m) => m.PercentCalc),
  },
  {
    path: 'temp-convertor',
    component: TempConvertor,
  },
  {
    path: 'loan-eligibility',
    component: LoanEligibility,
  },
];
