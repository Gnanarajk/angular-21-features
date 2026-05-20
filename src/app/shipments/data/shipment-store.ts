import { Shipment, ShipmentService } from './shipment-service';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, updateEntity, removeEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core/primitives/di';
import { tapResponse } from '@ngrx/operators';
import { debounceTime, distinctUntilChanged, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ShipmentState {
  query: string;
  isSearching: boolean;
  isSearchMode: boolean;
  searchResults: Shipment[];
  isLoading: boolean;
  error: string | null;
}

const initial_shipment_state: ShipmentState = {
  query: '',
  isLoading: false,
  isSearching: false, // ← separate flag for search
  error: null as string | null,
  isSearchMode: false, // ← track which mode we're in
  searchResults: [] as Shipment[], // ← separate from entities
};

export const ShipmentStore = signalStore(
  { providedIn: 'root' },
  withEntities<Shipment>(),
  withState<ShipmentState>(initial_shipment_state),
  withMethods((state, shipmentService = inject(ShipmentService)) => ({
    setQuery(query: string) {
      patchState(state, { query });
      if (query.trim() === '') {
        patchState(state, { isSearchMode: false, searchResults: [] });
      }
    },
    loadInitial() {
      patchState(state, { isLoading: true });
      shipmentService.getShipments().subscribe({
        next: (shipments: Shipment[]) => {
          patchState(state, setAllEntities(shipments), { isLoading: false });
        },
        error: (error) => {
          console.error('Error fetching shipments:', error);
          patchState(state, { isLoading: false, error: error.message });
        },
      });
    },

    searchShipment: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          // ← empty query — back to entities, no API call
          if (!query.trim()) {
            patchState(state, {
              //isSearchMode: false,
              isSearching: false,
              searchResults: [],
            });
            return EMPTY;
          }

          patchState(state, { isSearching: true, isSearchMode: true, error: null });
          return shipmentService.getShipments(query.trim()).pipe(
            tapResponse({
              next: (data) => patchState(state, { isSearching: false, searchResults: data }),
              error: (err: Error) => patchState(state, { error: err.message, isSearching: false }),
            }),
          );
        }),
        takeUntilDestroyed(),
      ),
    ),
    deleteShipment(id: number) {
      //patchState(state, { isLoading: true });
      return shipmentService.deleteShipment(id).pipe(
        tapResponse({
          next: () => {
            patchState(state, removeEntity(id));
            patchState(state, {
              searchResults: state.searchResults().filter((s) => s.id !== id),
            });
          },
          error: (error: Error) => {
            console.error('Error deleting shipment:', error);
            patchState(state, { isLoading: false, error: error.message });
          },
        }),
      );
    },
  })),

  // what the template actually consumes
  withComputed((state) => ({
    displayShipments: computed(
      () =>
        state.isSearchMode()
          ? state.searchResults() // ← API search results
          : state.entities(), // ← default loaded entities
    ),
    isBusy: computed(() => state.isLoading() || state.isSearching()),
  })),
  withHooks({
    onInit(store) {
      // store owns the reactive wiring — nothing leaks into the component
      store.loadInitial();
      store.searchShipment(store.query);
    },
  }),
);
