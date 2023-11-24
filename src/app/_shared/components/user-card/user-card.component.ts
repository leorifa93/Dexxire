import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {DistanceHelper} from "../../helper/Distance";
import {TranslateService} from "@ngx-translate/core";
import {LocationService} from "../../services/location.service";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent  implements OnInit {

  @Input() user: IUser;
  @Input() me: IUser;
  distance: string;
  currentCity: string;

  constructor(private translateService: TranslateService, private locationService: LocationService) {
  }

  ngOnInit() {
    const distance = (<any>DistanceHelper.calcDistance(
      this.me.currentLocation.lat,
      this.me.currentLocation.lng,
      this.user.currentLocation.lat,
      this.user.currentLocation.lng,
      0
    ));

    this.distance = DistanceHelper.kmToMiles(distance) > 99 ? '>99Mi' : DistanceHelper.kmToMiles(distance) + 'Mi';

    this.locationService.getCityFromLatLng(
      this.user.currentLocation.lat,
      this.user.currentLocation.lng
    ).then((formatAddress: any) => {
      this.currentCity = formatAddress[0].locality + ', ' + formatAddress[0].state;
    })
  }
}
