import { TestBed } from '@angular/core/testing';

import { ImageProofService } from './image-proof.service';

describe('ImageProofService', () => {
  let service: ImageProofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
