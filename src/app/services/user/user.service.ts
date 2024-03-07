import {Injectable, NgZone} from '@angular/core';
import {getAuth, signOut} from 'firebase/auth';
import {UserCollectionService} from "./user-collection.service";
import {Router} from "@angular/router";
import {IUser} from "../../interfaces/i-user";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import { google } from 'google-maps';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  GoogleAutoComplete: any;
  geocoder: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  constructor(private userCollectionService: UserCollectionService,
              private router: Router, private zone: NgZone
  ) {
    this.GoogleAutoComplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = {input: ''};
    this.autocompleteItems = [];
  }

  getStandardUsers(limit: number = 10, filter?, isOnSnapshot?: boolean, callback?: (snapshot) => void) {
    return this.userCollectionService.getAll(limit, null,  filter, [
      {key: 'membership', descending: 'desc'},
      {key: 'lastBoostAt', descending: 'desc'}
    ], null, isOnSnapshot, callback);
  }

  getUsers(limit: number = 10, distance: number = 100, order?: any, filter?: {key: string, opr: WhereFilterOp, value: string | number}[], offset?) {
    return this.userCollectionService.getAll(limit, offset,  filter, order);
  }
  signOut() {
    return signOut(getAuth());
  }

  showProfile(user: Partial<IUser>, me: IUser) {
    this.router.navigate(['/profile/' + user.id]);
  }

  getUserByQueryParams(userId?: string, city?: string, country?: string, federaleState?: string, filters?: {key: string, opr: WhereFilterOp, value: any}[], isSnapshot?: boolean, callback?: (snapshot) => void): Promise<IUser | IUser[]> | any {
    return new Promise((resolve, reject) => {
      const params: any = {
        input: federaleState ? city + ' ' + federaleState : city,
        types: ['(cities)']
      };

      if (country) {
        params.componentRestrictions = {country: country};
      }

      if (city) {
        this.GoogleAutoComplete.getPlacePredictions(params,
          (predictions: any) => {
            this.autocompleteItems = [];
            this.zone.run(async () => {

              if (predictions) {
                predictions.forEach((prediction: any) => {
                  this.autocompleteItems.push(prediction);
                });

                for (let item of this.autocompleteItems) {
                  if (!filters) {
                    filters = [];
                  }

                  filters.push({
                    key: 'location.placeId',
                    opr: '==',
                    value: item.place_id
                  });

                  document.dispatchEvent(new CustomEvent('place_id', {
                    detail: {
                      placeId: item.place_id
                    }
                  }));

                  if (userId) {
                    filters.push({
                      key: 'id',
                      opr: '==',
                      value: userId
                    });
                  }

                  if (!isSnapshot) {
                    const users = await this.userCollectionService.getAll(20, null, filters, [
                      {key: 'membership', descending: 'desc'},
                      {key: 'lastBoostAt', descending: 'desc'}
                    ]);

                    if (users.length > 0 && userId) {
                      resolve(users[0]);
                    } else {
                      resolve(users);
                    }
                  } else {
                    resolve(this.userCollectionService.observer(userId, callback));
                  }
                }

                reject();
              } else {
                reject();
              }
            });
          });
      } else {
        if (!isSnapshot) {
          this.userCollectionService.get(userId).then((user) => {
            if (user) {
              resolve(user);
            }

            reject();
          })
        } else {
          resolve(this.userCollectionService.observer(userId, callback));
        }
      }
    })
  }

  async getUsersByPlaceId(placeId: string, filters?: {key: string, opr: WhereFilterOp, value: string | number}[]) {
    if (!filters) {
      filters = [];
    }

    filters.push({
      key: 'location.placeId',
      opr: '==',
      value: placeId
    });

    return this.userCollectionService.getAll(1, null, filters);
  }
}
