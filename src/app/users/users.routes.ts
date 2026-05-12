import { Routes } from '@angular/router';
import { UserList } from './features/user-list/user-list';
import { UserDetail } from './features/user-detail/user-detail';
import { provideStore } from '@ngrx/store';
import { usersReducer } from './data/users.store';
import { UsersEffects } from './data/users.effects';
import { provideEffects } from '@ngrx/effects';

export const usersRoute: Routes = [
  {
    path: '',
    component: UserList,
    providers: [provideStore({ users: usersReducer }), provideEffects(UsersEffects)],
  },
  {
    path: ':id',
    component: UserDetail,
    // resolve: {
    //   userData: userResolver,
    // },
  },
];
