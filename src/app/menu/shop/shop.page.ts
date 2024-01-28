import {Component, Input, OnInit} from '@angular/core';
import {BtcPayService} from "./services/btc-pay.service";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {AlertController, ModalController, NavController} from "@ionic/angular";
import {IUser} from "../../interfaces/i-user";
import {IInvoiceCreation} from "./interfaces/i-invoice-creation";
import {environment} from "../../../environments/environment";
import {BuyService} from "./services/buy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  @Input() type: 'page' | 'modal' = 'page';
  user: IUser;
  selectedPackage: any;
  packages: any[] = [
    {amount: 50, price: 70, pricePerCoin: "1.40", isChecked: false},
    {amount: 100, price: 120, pricePerCoin: "1.20", isChecked: false},
    {amount: 150, price: 170, pricePerCoin: "1.13", isChecked: false},
    {amount: 200, price: 200, pricePerCoin: "1.00", isChecked: false},
    {amount: 300, price: 270, pricePerCoin: "0.90", isChecked: false},
    {amount: 500, price: 400, pricePerCoin: "0.80", isChecked: false},
    {amount: 1000, price: 700, pricePerCoin: "0.70", isChecked: false},
  ];

  constructor(private btcPayService: BtcPayService, private localStorage: LocalStorageService,
              private navCtrl: NavController, private modalCtrl: ModalController, private buyService: BuyService,
              private alertCtrl: AlertController, private translateService: TranslateService) {
    this.localStorage.getUser().then((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.registerEvents();
  }

  registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    })
  }

  goBack() {
    if (this.type === 'modal') {
      return this.modalCtrl.dismiss();
    } else {
      return this.navCtrl.pop();
    }
  }

  selectPackage(selectedPackage: any) {
    this.selectedPackage = selectedPackage;

    for (let p of this.packages) {
      if (p.price === selectedPackage.price) {
        p.isChecked = true;
      } else {
        p.isChecked = false;
      }
    }
  }

  buy() {
    const invoiceCreation: IInvoiceCreation = {
      price: this.selectedPackage.price,
      currency: 'USD',
      orderId: this.user.username,
      itemDesc: this.selectedPackage.amount + ' Coins',
      notificationUrl: environment.btcPay.invoiceNotificationUrl,
      redirectUrl: environment.btcPay.invoiceRedirectUrl
    }

    this.btcPayService.createInvoice(invoiceCreation).then((paid) => {
      if (paid) {
        this.buyService.addCoinsToUser(this.user, this.selectedPackage.amount);
      }
    })
  }
}
