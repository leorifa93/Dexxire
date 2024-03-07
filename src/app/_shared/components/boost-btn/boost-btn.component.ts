import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AlertController, ModalController} from "@ionic/angular";
import {IUser} from "../../../interfaces/i-user";
import {BuyService} from "../../../menu/shop/services/buy.service";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {LocalStorageService} from "../../services/local-storage.service";
import { BoostComponent } from '../boost/boost.component';

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
  loading: boolean = true;

  constructor(private translateService: TranslateService, private alertCtrl: AlertController,
              private buyService: BuyService, private userCollectionService: UserCollectionService,
              private localStorage: LocalStorageService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    const filter = await this.localStorage.getFilter();

    if (filter) {
      this.filter = Object.assign(this.filter, filter);
    }
    this.getRangPosition();

    document.addEventListener('update-rang', () => this.getRangPosition());

    this.positionInterval = setInterval(() => {
      return this.getRangPosition();
    }, 5000);
  }

  async setBoost() {
    const modal = await this.modalCtrl.create({
      component: BoostComponent,
      componentProps: {
        rang: this.rang,
        user: this.user
      }
    });

    return modal.present();
  }

  async getRangPosition() {
    //this.loading = true;

    if (!this.user) {
      return;
    }

    
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

    this.loading = false;
  }

  ngOnDestroy() {
    clearInterval(this.positionInterval);
  }
}
