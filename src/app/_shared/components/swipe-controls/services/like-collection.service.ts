import { Injectable } from '@angular/core';
import {CollectionService} from "../../../../services/collection.service";
import {doc, onSnapshot} from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class LikeCollectionService extends CollectionService {

  constructor() {
    super();
    this.collectionName  = 'Likes';
  }
}
