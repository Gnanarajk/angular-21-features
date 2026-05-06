import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { UsersActions } from '../data/users.store';

export const userResolver: ResolveFn<boolean> = (route) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');
  if (id) {
    store.dispatch(UsersActions.loadUser({ id }));
  }
  return true; // Navigation continues once dispatch is sent
};
