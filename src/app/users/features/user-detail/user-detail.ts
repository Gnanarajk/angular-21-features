import { Component, computed, effect, inject, input, Input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllUsers, selectUser, User, UsersActions } from '../../data/users.store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  //userId = input.required<string | number>();
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private userId = this.route.snapshot.paramMap.get('id') || signal<string | number | null>(null);

  // This signal will reactively update whenever userId() OR the store changes
  protected user = computed(() => {
    const id = this.userId?.toString();
    if (!id) return null;

    // We use selectSignal here to get the data,
    // but we call it immediately to get the VALUE for the computed signal
    return this.store.selectSignal(selectUser(id))();
  });

  constructor() {
    effect(() => {
      const id = this.userId?.toString();
      if (id && id !== 'undefined') {
        this.store.dispatch(UsersActions.loadUser({ id: id.toString() }));
      }
    });
  }
}
