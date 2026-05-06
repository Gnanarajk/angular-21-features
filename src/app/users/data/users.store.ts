import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  role: string;
  gender: string;
}

export interface UsersState {
  entities: { [id: string]: User };
  loading: boolean;
  error: any;
}

// --- ACTIONS ---

export const UsersActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': emptyProps(),
    'Load User': props<{ id: string | number }>(),
    'Load All Users Success': props<{ users: User[] }>(),
    'Load User Success': props<{ user: User }>(),
    'Load Users Failure': props<{ error: any }>(),
  },
});

// --- REDUCER ---

const initialState: UsersState = {
  entities: {},
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(UsersActions.loadUser, (state, { id }) => ({ ...state, loading: true })),
  on(UsersActions.loadAllUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    entities: {
      ...state.entities,
      ...users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}),
    },
  })),
  on(UsersActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    entities: { ...state.entities, [user.id]: user },
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);

// --- SELECTORS ---
const selectUsersFeature = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(selectUsersFeature, (state) =>
  Object.values(state.entities),
);
export const selectUser = (id: string | number) =>
  createSelector(selectUsersFeature, (state) => state.entities[id]);

export const selectAdminUsers = createSelector(selectAllUsers, (users) =>
  users.filter((user: any) => user.role === 'admin'),
);
