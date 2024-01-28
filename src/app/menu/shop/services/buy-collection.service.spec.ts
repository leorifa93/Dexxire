import { TestBed } from '@angular/core/testing';

import { BuyCollectionService } from './buy-collection.service';

describe('BuyCollectionService', () => {
  let service: BuyCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
