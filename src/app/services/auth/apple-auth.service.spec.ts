import { TestBed } from '@angular/core/testing';

import { AppleAuthService } from './apple-auth.service';

describe('AppleAuthService', () => {
  let service: AppleAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppleAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
