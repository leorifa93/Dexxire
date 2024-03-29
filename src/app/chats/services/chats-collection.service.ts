import { Injectable } from '@angular/core';
import {CollectionService} from "../../services/collection.service";

@Injectable({
  providedIn: 'root'
})
export class ChatsCollectionService extends CollectionService {

  constructor() {
    super();

    this.collectionName = 'Chats';
  }
}
