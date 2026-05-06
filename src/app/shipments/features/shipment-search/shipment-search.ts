import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ShipmentStore } from '../../data/shipment-store';
import { ShipmentList } from '../shipment-list/shipment-list';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Shipment, ShipmentService } from '../../data/shipment-service';

@Component({
  selector: 'app-shipment-search',
  imports: [ShipmentList],
  templateUrl: './shipment-search.html',
  styleUrl: './shipment-search.scss',
})
export class ShipmentSearch {
  private store = inject(ShipmentStore);
  private shipmentService = inject(ShipmentService);
  searchQuery = signal('');

  shipments = this.store.shipments;

  constructor() {
    this.store.loadInitial();
    toObservable(this.searchQuery)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query) {
            return this.shipmentService.getShipments(query);
          } else {
            return this.shipmentService.getShipments();
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe((shipments) => {
        this.store.setShipments(shipments);
      });
  }
}
