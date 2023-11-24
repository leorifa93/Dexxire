import { Injectable } from '@angular/core';
import {Countries} from "../../constants/Countries";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor() { }

  public getAll(): Promise<{ country: string, key: string, region: string, flag: string }[]> {
    return new Promise((resolve) => {
      resolve(CountriesService.mapCountries(Countries));
    });
  }

  private static mapCountries(countries: any) {
    const newCountries = [];

    for (let country of countries) {
      newCountries.push({
        country: country.name,
        key: country.alpha3Code,
        region: country.region,
        flag: country.flag || null
      });
    }

    return newCountries;
  }
}
