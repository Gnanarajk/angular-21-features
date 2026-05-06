import { Injectable, signal } from '@angular/core';
import { Shipment, ShipmentService } from './shipment-service';

@Injectable({
  providedIn: 'root',
})
export class ShipmentStore {
  private _shipments = signal<Shipment[]>([]);
  shipments = this._shipments.asReadonly();

  constructor(private shipmentService: ShipmentService) {}

  loadInitial() {
    this.fetchShipments();
  }

  setShipments(shipments: Shipment[]) {
    this._shipments.set(shipments);
  }

  updateShipments(shipments: Shipment[]) {
    this._shipments.update((prev) => [...prev, ...shipments]);
  }

  fetchShipments() {
    this.shipmentService.getShipments().subscribe({
      next: (shipments: Shipment[]) => {
        this.updateShipments(shipments);
      },
      error: (error) => {
        console.error('Error fetching shipments:', error);
      },
    });
  }
}
