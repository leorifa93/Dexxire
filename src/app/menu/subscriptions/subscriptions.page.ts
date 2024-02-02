import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController} from "@ionic/angular";
import {ShopPage} from "../shop/shop.page";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {TranslateService} from "@ngx-translate/core";
import {BuyService} from "../shop/services/buy.service";
import {AbstractBase} from "../../_shared/classes/AbstractBase";
import {UserCollectionService} from "../../services/user/user-collection.service";

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
})
export class SubscriptionsPage extends AbstractBase implements OnInit {

  constructor(protected navCtrl: NavController, private modalCtrl: ModalController, public localStorage: LocalStorageService,
               private buyService: BuyService, protected changeDetector: ChangeDetectorRef, private userCollectionService: UserCollectionService) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.pop();
  }

  registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    })
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

  async subscribe(subscription: any) {
    return this.buyService.subscribe(subscription, this.user);
  }

  updateUser() {
    return this.userCollectionService.set(this.user.id, this.user);
  }
}
