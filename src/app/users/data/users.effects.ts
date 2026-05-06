import { inject, Injectable } from '@angular/core';
import { UsersActions } from './users.store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersApi } from './users.api';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs/internal/observable/of';
import { filter } from 'rxjs';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private api = inject(UsersApi);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.api.getUsers().pipe(
          map((response: any) => UsersActions.loadAllUsersSuccess({ users: response })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error }))),
        ),
      ),
    ),
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      filter((action) => !!action.id && action.id !== 'undefined'),
      switchMap(({ id }) =>
        this.api.getUser(id).pipe(
          map((response: any) => UsersActions.loadUserSuccess({ user: response })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error }))),
        ),
      ),
    ),
  );
}
