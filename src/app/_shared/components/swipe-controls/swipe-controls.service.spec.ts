import { TestBed } from '@angular/core/testing';

import { SwipeControlsService } from './swipe-controls.service';

describe('SwipeControlsService', () => {
  let service: SwipeControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwipeControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
