import { Component, computed, effect, inject, resource, signal } from '@angular/core';
import { ShipmentStore } from '../../data/shipment-store';
import { ShipmentList } from '../shipment-list/shipment-list';

@Component({
  selector: 'app-shipment-search',
  imports: [ShipmentList],
  templateUrl: './shipment-search.html',
  styleUrl: './shipment-search.scss',
})
export class ShipmentSearch {
  store = inject(ShipmentStore);
  deletingIds = signal<Set<number>>(new Set());

  // derived — filters store entities locally
  // does NOT write to store.query

  onDelete(id: number) {
    this.deletingIds.update((ids) => new Set([...ids, id]));
    this.store.deleteShipment(id).subscribe({
      next: () => this.removeDeleting(id),
      error: () => this.removeDeleting(id),
    });
  }

  private removeDeleting(id: number) {
    this.deletingIds.update((ids) => {
      const next = new Set(ids);
      next.delete(id);
      return next;
    });
  }
}
