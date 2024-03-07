import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private http: HttpClient) { 

  }

  setNextBoost(userId: string) {
    let url;

    if (!environment.production) {
      url = 'http://127.0.0.1:5001/dexxire-dfcba/us-central1/setNextBoost';
    } else {
      url = ' https://setnextboost-ytbcdg7bga-uc.a.run.app';
    }

    return this.http.get(url + '?userId=' + userId).toPromise();
  }
}
