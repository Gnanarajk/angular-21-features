import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllUsers, selectAdminUsers, UsersActions } from '../../data/users.store';
import { HasPermission } from '../../../has-permission';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private store = inject(Store);
  users$ = this.store.selectSignal(selectAllUsers);

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
