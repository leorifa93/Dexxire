import {Injectable} from '@angular/core';
import {CollectionService} from "../collection.service";

@Injectable({
  providedIn: 'root'
})
export class UserCollectionService extends CollectionService {


  constructor() {
    super();

    this.collectionName = 'Users';
  }
}
