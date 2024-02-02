import {Injectable} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {Membership} from "../../../constants/User";
import {UserService} from "../../../services/user/user.service";
import {BuyCollectionService} from "./buy-collection.service";
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {ShopPage} from "../shop.page";
import {ProfileHelper} from "../../../_shared/helper/Profile";
import {CongratulationsComponent} from "../../../_shared/components/congratulations/congratulations.component";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private userService: UserCollectionService, private buyCollectionService: BuyCollectionService,
              private alertCtrl: AlertController, private translateService: TranslateService,
              private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  private upgradeUser(user: IUser, subscription: any) {
    user.availableCoins -= subscription.price;

    if (subscription.type === 'gold') {
      user.membership = Membership.Gold;
    } else if (subscription.type === 'vip') {
      user.membership = Membership.VIP;
    }

    let now = new Date();
    let current: Date;

    if (now.getMonth() == 11) {
      current = new Date(now.getFullYear() + 1, 0, now.getDay());
    } else {
      current = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay());
    }
    user.membershipExpiredAt = ProfileHelper.getFormattedDate(current);

    return this.buyCollectionService.add({
      userId: user.id,
      type: 'UPGRADE',
      createdAt: now.getTime(),
      expiredAt: current.getTime(),
      payload: {
        price: subscription.price,
        upgradeType: subscription.type
      }
    }).then(() => {
      return this.userService.set(user.id, user);
    })
  }

  addCoinsToUser(user: IUser, coins: number) {
    if (!user.availableCoins) {
      user.availableCoins = 0;
    }

    user.availableCoins += coins;

    return this.userService.set(user.id, user).then(async () => {
      const alert = await this.alertCtrl.create({
        message: this.translateService.instant('YOUAREREADY')
      });

      return alert.present();
    })
  }

  async setBoost(user: IUser) {
    if (user.availableCoins > 0) {
      user.lastBoostAt = new Date().getTime() / 1000;
      user.availableCoins -= 1;

      this.userService.set(user.id, user).then(async () => {
        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('PROFILEBOOSTED'),
          duration: 2000
        });

        return toast.present();
      })
    } else {
      const alert = await this.alertCtrl.create({
        message: this.translateService.instant('NOTENOUGHCOINS'),
        buttons: [{
          text: this.translateService.instant('BUY'),
          handler: () => {
            this.showShop();
          }
        }, {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel'
        }]
      });

      alert.present();
    }
  }

  async showShop() {
    const modal = await this.modalCtrl.create({
      component: ShopPage,
      componentProps: {
        type: 'modal'
      }
    });

    modal.present();
  }

  async subscribe(subscription: any, user: IUser) {
    user.availableCoins = 1000;

    if ((user.availableCoins || 0) < subscription.price && environment.production === true) {
      const alert = await this.alertCtrl.create({
        message: this.translateService.instant('NOTENOUGHCOINS'),
        buttons: [{
          text: this.translateService.instant('BUY'),
          handler: () => {
            this.showShop();
          }
        }, {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel'
        }]
      });

      return alert.present();
    } else {
      return this.upgradeUser(user, subscription).then(async () => {
        const modal = await this.modalCtrl.create({
          component: CongratulationsComponent,
          cssClass: 'congratulations-modal'
        });

        return modal.present();
      })
    }
  }
}
