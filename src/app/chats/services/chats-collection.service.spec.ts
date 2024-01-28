import { TestBed } from '@angular/core/testing';

import { ChatsCollectionService } from './chats-collection.service';

describe('ChatsCollectionService', () => {
  let service: ChatsCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
