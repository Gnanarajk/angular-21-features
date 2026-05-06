import { Routes } from '@angular/router';
import { UserList } from './features/user-list/user-list';
import { UserDetail } from './features/user-detail/user-detail';
import { userResolver } from './utils/user-detail.resolver';

export const usersRoute: Routes = [
  {
    path: '',
    component: UserList,
  },
  {
    path: ':id',
    component: UserDetail,
    // resolve: {
    //   userData: userResolver,
    // },
  },
];
