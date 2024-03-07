import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BtcPayService } from "./services/btc-pay.service";
import { LocalStorageService } from "../../_shared/services/local-storage.service";
import { AlertController, ModalController, NavController, Platform } from "@ionic/angular";
import { IUser } from "../../interfaces/i-user";
import { IInvoiceCreation } from "./interfaces/i-invoice-creation";
import { environment } from "../../../environments/environment";
import { BuyService } from "./services/buy.service";
import { TranslateService } from "@ngx-translate/core";
import { IAPProduct, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Capacitor } from '@capacitor/core';

const PRODUCT_GEMS_KEY = 'coins50';
const PRODUCT_PRO_KEY = 'devpro';

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
    { amount: 50, price: 69, pricePerCoin: "1.40", isChecked: false, productKey: '50Coins' },
    { amount: 100, price: 119, pricePerCoin: "1.20", isChecked: false, productKey: '100Coins' },
    { amount: 150, price: 169, pricePerCoin: "1.13", isChecked: false, productKey: '150Coins'  },
    { amount: 200, price: 199, pricePerCoin: "1.00", isChecked: false, productKey: '200Coins'  },
    { amount: 300, price: 269, pricePerCoin: "0.90", isChecked: false, productKey: '300Coins'  },
    { amount: 500, price: 399, pricePerCoin: "0.80", isChecked: false, productKey: '500Coins'  },
    { amount: 1000, price: 699, pricePerCoin: "0.70", isChecked: false, productKey: '1000Coins'  },
  ];
  products: IAPProduct[] = [];
  loading: boolean = false;
  isBought: boolean = false;

  constructor(private btcPayService: BtcPayService, private localStorage: LocalStorageService,
    private navCtrl: NavController, private modalCtrl: ModalController, private buyService: BuyService,
    private alertCtrl: AlertController, private translateService: TranslateService,
    private store: InAppPurchase2, private changeDetector: ChangeDetectorRef, private platform: Platform) {
    this.platform.ready().then(() => {
      this.registerEvents();

      if (Capacitor.isNativePlatform()) {
        this.registerProducts();

        this.store.ready(() => {
          for (let product of this.store.products) {
            this.packages = this.packages.map((pack) => {
              if (pack.productKey === product.id) {
                pack.product = product;
              }

              return pack;
            })
          }
        })
      }
    })

    this.localStorage.getUser().then((user) => {
      this.user = user;
    });

  }

  ngOnInit() {
    this.registerProducts();
    this.registerEvents();
  }

  registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    });

    if (Capacitor.isNativePlatform()) {
      this.store.when('product')
        .approved((p: IAPProduct) => {
          if (this.selectedPackage && p.id === this.selectedPackage.productKey && !this.isBought) {
            this.isBought = true;
            this.buyService.addCoinsToUser(this.user, this.selectedPackage.amount, true);
          }
          this.changeDetector.detectChanges();

          return p.verify();
        }).verified((p: IAPProduct) => p.finish());
    }
  }

  purchase(product: IAPProduct) {
    this.store.order(product).then(p => {
      this.loading = false;
      this.isBought = false;
    }, e => {
      console.log(e.message);
    });
  }

  restore() {
    this.store.refresh();
  }

  goBack() {
    if (this.type === 'modal') {
      return this.modalCtrl.dismiss();
    } else {
      return this.navCtrl.pop();
    }
  }

  registerProducts() {
    for (let pack of this.packages) {

      if (pack.productKey) {
        this.store.register({
          id: pack.productKey,
          type: this.store.CONSUMABLE,
        });
      }
    }

    this.store.autoFinishTransactions = true;
    this.store.refresh();
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
    this.loading = true;
    const invoiceCreation: IInvoiceCreation = {
      price: this.selectedPackage.price,
      currency: 'USD',
      orderId: this.user.username,
      itemDesc: this.selectedPackage.amount + ' Coins',
      notificationUrl: environment.btcPay.invoiceNotificationUrl,
      redirectUrl: environment.btcPay.invoiceRedirectUrl
    }

    if (this.selectedPackage.product) {
      this.purchase(this.selectedPackage.product);
    } else {
      this.btcPayService.createInvoice(invoiceCreation).then((paid) => {
        this.loading = false;

        if (paid) {
          this.buyService.addCoinsToUser(this.user, this.selectedPackage.amount);
        }
      })
    }
  }
}
