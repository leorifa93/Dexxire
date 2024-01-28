import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {DistanceHelper} from "../../helper/Distance";
import {TranslateService} from "@ngx-translate/core";
import {LocationService} from "../../services/location.service";
import {Distance} from "../../../constants/Units";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {

  @Input() user: IUser;
  @Input() me: IUser;
  @Input() type: string = 'standard';
  @Input() loading: boolean = false;
  distance: string;
  currentCity: string;

  constructor(private translateService: TranslateService, private locationService: LocationService) {
  }

  ngOnInit() {
    if (this.user.currentLocation) {
      const distance = parseFloat(DistanceHelper.calcDistance(
        this.me.currentLocation.lat,
        this.me.currentLocation.lng,
        this.user.currentLocation.lat,
        this.user.currentLocation.lng,
        5
      ));

      if (this.me._settings.units.distanceType === Distance.Mi) {
        this.distance = DistanceHelper.kmToMiles(distance) > 99 ? '>99Mi' : DistanceHelper.kmToMiles(distance).toFixed(1) + 'Mi';
      } else {
        this.distance = distance > 99 ? '>99Km' : ((<number>distance) > 0 ? (<number>distance).toFixed(1) : distance) + 'Km';
      }

      this.locationService.getCityFromLatLng(
        this.user.currentLocation.lat,
        this.user.currentLocation.lng
      ).then((formatAddress: any) => {
        this.currentCity = formatAddress[0].locality + ', ' + formatAddress[0].state;
      })
    }
  }
}
