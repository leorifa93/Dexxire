import { TestBed } from '@angular/core/testing';

import { BtcPayService } from './btc-pay.service';

describe('BtcPayService', () => {
  let service: BtcPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtcPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
