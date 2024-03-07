import { Injectable } from '@angular/core';
import { CollectionService } from 'src/app/services/collection.service';

@Injectable({
  providedIn: 'root'
})
export class ImageProofService extends CollectionService {

  constructor() { 
    super();

    this.collectionName = 'ImageProofQueue';
  }
}
