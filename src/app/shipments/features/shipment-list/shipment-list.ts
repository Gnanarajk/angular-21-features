import {
  Component,
  computed,
  inject,
  input,
  Input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Shipment } from '../../data/shipment-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-list',
  imports: [FormsModule],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.scss',
})
export class ShipmentList {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Inputs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  shipments = input<Shipment[]>([]);
  deletingIds = input<Set<number>>(new Set());
  isLoading = input<boolean>(false);
  isSearchMode = input<boolean>(false);

  // two-way — each instance owns its own query
  // parent can also bind: [(searchQuery)]="parentQuery"
  searchQuery = model<string>('');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Outputs
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  deleteRequest = output<number>();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Derived
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  isEmpty = computed(() => !this.isLoading() && this.shipments().length === 0);

  emptyMessage = computed(() =>
    this.searchQuery() ? 'No shipments match your search' : 'No shipments found',
  );

  loadingMessage = computed(() =>
    this.isSearchMode() ? 'Searching all shipments...' : 'Loading shipments...',
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Methods
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  deleteShipment(id: number) {
    this.deleteRequest.emit(id);
  }

  isDeleting(id: number): boolean {
    return this.deletingIds().has(id);
  }

  clearSearch() {
    this.searchQuery.set('');
  }
}
