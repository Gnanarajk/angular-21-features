import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllUsers, UsersActions } from '../../data/users.store';
import { HasPermission } from '../../../shared/directives/has-permission';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/data/auth-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, HasPermission, JsonPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private store = inject(Store);
  protected authService = inject(AuthService);
  typeofRole = () => typeof this.authService.userRole();
  users$ = this.store.selectSignal(selectAllUsers);

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
