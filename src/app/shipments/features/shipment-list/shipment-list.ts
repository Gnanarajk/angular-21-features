import { Component, inject, input, Input, OnInit } from '@angular/core';
import { Shipment } from '../../data/shipment-service';

@Component({
  selector: 'app-shipment-list',
  imports: [],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.scss',
})
export class ShipmentList {
  shipments = input<Shipment[]>([]);
}
