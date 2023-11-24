import { Injectable } from '@angular/core';
import {getAuth, signOut} from 'firebase/auth';
import {UserCollectionService} from "./user-collection.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userCollectionService: UserCollectionService
  ) { }

  getStandardUsers(limit: number = 10) {
    return this.userCollectionService.getAll(limit, null,  null, 'membership');
  }
  signOut() {
    return signOut(getAuth());
  }
}
