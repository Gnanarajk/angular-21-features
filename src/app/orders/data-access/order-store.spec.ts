import { TestBed } from '@angular/core/testing';

import { OrderStore } from './order-store';

describe('OrderStore', () => {
  let service: OrderStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
