import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";
import {IUser} from "../../../interfaces/i-user";
import {BuyService} from "../../../menu/shop/services/buy.service";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-boost-btn',
  templateUrl: './boost-btn.component.html',
  styleUrls: ['./boost-btn.component.scss'],
})
export class BoostBtnComponent  implements OnInit {

  @Input() user: IUser;
  rang: number = 1;
  filter: any = {
    perimeterValue: 100,
    ageRange: {
      lower: 18,
      upper: 80
    }
  };
  positionInterval: any;

  constructor(private translateService: TranslateService, private alertCtrl: AlertController,
              private buyService: BuyService, private userCollectionService: UserCollectionService,
              private localStorage: LocalStorageService) { }

  async ngOnInit() {
    const filter = await this.localStorage.getFilter();

    if (filter) {
      this.filter = Object.assign(this.filter, filter);
    }

    document.addEventListener('update-rang', () => this.getRangPosition());

    this.positionInterval = setInterval(() => {
      return this.getRangPosition();
    }, 5000);
  }

  async setBoost() {
    const alert = await this.alertCtrl.create({
      header: this.translateService.instant('POSITION') + this.rang,
      message: this.translateService.instant('YOUAREONPOSITION') + this.rang + this.translateService.instant('USEABOOST'),
      buttons: [{
        text: this.translateService.instant('USEBOOST'),
        handler: () => {
          return this.buyService.setBoost(this.user);
        }
      }, {
        text: this.translateService.instant('CANCEL'),
        role: 'cancel'
      }]
    });

    return alert.present();
  }

  async getRangPosition() {
    const queryFilter: { key: string, opr: WhereFilterOp, value: any }[] = [];
    queryFilter.push({
      key: 'gender',
      opr: '==',
      value: this.user.gender
    }, {
      key: 'membership',
      opr: '==',
      value: this.user.membership
    });

    if (!this.user.currentLocation) {
      return;
    }

    let usersByDistance = await this.userCollectionService.getUsersByDistance(this.user.currentLocation,
      this.filter.perimeterValue ? this.filter.perimeterValue : 100, queryFilter);

    usersByDistance = usersByDistance.sort((a, b) => {
      return a.lastBoostAt < b.lastBoostAt ? 1 : -1;
    });

    if (usersByDistance.length > 0) {
      let rang = 1;

      for (let user of usersByDistance) {
        if (user.id === this.user.id) {
          break;
        }

        rang++;
      }

      this.rang = rang;
    } else {
      this.rang = 1;
    }
  }

  ngOnDestroy() {
    clearInterval(this.positionInterval);
  }
}
