import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {LocalStorageService} from "./local-storage.service";
import {Geolocation} from '@capacitor/geolocation';
import {Geohash, geohashForLocation} from "geofire-common";

declare var google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private environment = environment;

  constructor(
    private geoLocation: Geolocation,
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {
  }

  async detectCurrentLocation(): Promise<{lat: number, lng: number, hash: Geohash}> {
    const user = await this.localStorage.getUser();

    return new Promise<{lat: number, lng: number, hash: Geohash}>((resolve) => {
      Geolocation.getCurrentPosition().then((res) => {
        resolve({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
          hash: geohashForLocation([res.coords.latitude, res.coords.longitude])
        });
      }).catch(async (err) => {
        const latLang = await this.getGeoLatLng(user.location.placeId);
        resolve({
          lat: latLang.lat,
          lng: latLang.lng,
          hash: geohashForLocation([latLang.lat, latLang.lng])
        });
      });
    });
  }
  private formatAddress(googleAddr: any): any {
    let properAddress: any = {
      latitude: '',
      longitude: '',
      address: '',
      premises: '',
      area: '',
      street: '',
      locality: '',
      state: '',
      country: '',
      timezone: '',
      pincode: ''
    };

    let acutalPremise = '';

    if (googleAddr && googleAddr.address_components) {

      googleAddr.address_components.forEach((addr:any) => {

        // country
        if (addr.types.indexOf('country') != -1) {

          properAddress.country = addr.long_name;
        }

        // state
        if (addr.types.indexOf('administrative_area_level_1') != -1) {

          properAddress.state = addr.short_name;
        }

        // Area
        if (addr.types.indexOf('sublocality_level_1') != -1) {

          properAddress.area = addr.long_name;
        }

        // locality
        if (addr.types.indexOf('locality') != -1) {

          properAddress.locality = addr.long_name;
        }

        // street
        if (addr.types.indexOf('route') != -1) {

          properAddress.street = addr.long_name;
        }
        // acutal address premises

        if (addr.types.indexOf('premise') != -1) {

          acutalPremise = addr.long_name;
        }

        // postal code
        if (addr.types.indexOf('postal_code') != -1) {

          properAddress.pincode = addr.long_name;
        }
      });
    }

    return properAddress;
  }

  getCityFromLatLng(lat: number, lng: number) {
    let uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=` + environment.googleApiKey;
    uri = encodeURI(uri);

    return new Promise(resolve => {
      this.http.get(uri)
        .toPromise()
        .then((result: any) => {
          var response = [];
          for (let res of result.results) {
            response.push(this.formatAddress(res));
          }

          resolve(response);
        });
    })
  }
  getDataFromAddress(address: string): Promise<{ address: string, location: any, placeId: string }> {
    let uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + environment.googleApiKey;
    uri = encodeURI(uri);

    return new Promise(resolve => {
      this.http.get(uri)
        .toPromise()
        .then((result: any) => {
          let data = result.results[0];
          const formattedAddress = data.formatted_address;
          const latLang = data.geometry.location;
          const placeId = data.place_id;

          const addressData = {
            address: formattedAddress,
            location: latLang,
            placeId: placeId
          };

          resolve(addressData);
        });
    })
  }

  getDistance(origin: any, destination: any): Promise<any> {
    const matrix = new google.maps.DistanceMatrixService();

    return new Promise(resolve => {
      matrix.getDistanceMatrix({
        origins: [{placeId: origin.placeId}],
        destinations: [{placeId: destination.placeId}],
        travelMode: google.maps.TravelMode.DRIVING,
      }, (data) => {
        resolve(data);
      });
    })
  }

  private getGeoLatLng(placeId: string): Promise<{lat: number, lng: number}> {
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({
          'placeId': placeId
        },
        (responses, status) => {
          if (status == 'OK') {
            resolve({
              lat: responses[0].geometry.location.lat(),
              lng: responses[0].geometry.location.lng()
            })
          }
        });
    })
  }
}
