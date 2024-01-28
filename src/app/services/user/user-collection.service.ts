import {Injectable} from '@angular/core';
import {CollectionService} from "../collection.service";
import {distanceBetween, geohashQueryBounds} from "geofire-common";
import {startAt, endAt, collection, query, getDocs, orderBy, where, onSnapshot, doc, or} from "firebase/firestore";
import {IUser} from "../../interfaces/i-user";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;


@Injectable({
  providedIn: 'root'
})
export class UserCollectionService extends CollectionService {

  observe: any;
  constructor() {
    super();

    this.collectionName = 'Users';
  }

  async getUsersByDistance(currentLocation: { lat: number, lng: number }, distance: number = 10, filters?: { key: string, opr: WhereFilterOp, value: string | number }[],
                           order?: any): Promise<IUser[]> {
    const center: any = [currentLocation.lat, currentLocation.lng];
    const bounds = geohashQueryBounds(center, distance * 1000);
    const promises = [];
    let queryFilters = [];
    let queryOrders = [];

    if (filters) {

      for (let filter of filters) {
        queryFilters.push(where(filter.key, filter.opr, filter.value))
      }
    }

    if (order) {
      if (typeof(order) === 'object') {
        for (let o of order) {
          queryOrders.push(orderBy(o.key, o.descending));
        }
      } else {
        queryOrders.push(orderBy(order, 'desc'));
      }
    }

    for (const b of bounds) {
      const q = query(
        collection(this.db, 'Users'),
        ...queryFilters,
        orderBy(order ? order : 'currentLocation.hash'),
        startAt(b[0]),
        endAt(b[1]));

      promises.push(getDocs(q));
    }

    const snapshots = await Promise.all(promises);

    const users: IUser[] = [];
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('currentLocation.lat');
        const lng = doc.get('currentLocation.lng');

        const distanceInKm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= distance * 1000) {
          users.push(doc.data());
        }
      }
    }

    return users;
  }

  startObserver(userId: string, callback: (user: any) => void) {
    this.observe = onSnapshot(doc(this.db, this.collectionName, userId), (doc) => {
      callback(doc.data());
    });
  }
}
