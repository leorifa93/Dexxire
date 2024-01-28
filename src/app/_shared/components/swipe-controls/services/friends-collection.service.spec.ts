import { TestBed } from '@angular/core/testing';

import { FriendsCollectionService } from './friends-collection.service';

describe('FriendsCollectionService', () => {
  let service: FriendsCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendsCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
