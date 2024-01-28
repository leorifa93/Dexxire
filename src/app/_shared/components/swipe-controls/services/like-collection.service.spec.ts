import { TestBed } from '@angular/core/testing';

import { LikeCollectionService } from './like-collection.service';

describe('LikeCollectionService', () => {
  let service: LikeCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
