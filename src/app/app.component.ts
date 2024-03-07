import { Component } from '@angular/core';
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { getAuth } from "firebase/auth";
import { UserCollectionService } from "./services/user/user-collection.service";
import { IUser } from "./interfaces/i-user";
import { LocalStorageService } from "./_shared/services/local-storage.service";
import { Router } from "@angular/router";
import { Device } from '@capacitor/device';
import { STATUS_ACTIVE, STATUS_PENDING } from "./constants/User";
import { LocationService } from "./_shared/services/location.service";
import { AlertController, ModalController, NavController } from "@ionic/angular";
import { CustomSplashComponent } from "./_shared/components/custom-splash/custom-splash.component";
import { register } from 'swiper/element/bundle';
import { geohashForLocation } from "geofire-common";
import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import firebase from "firebase/compat";
import Unsubscribe = firebase.Unsubscribe;
import { PushService } from "./_shared/services/push.service";
import { Badge } from '@robingenz/capacitor-badge';
import { ProfileHelper } from "./_shared/helper/Profile";
import { MaintenanceComponent } from "./_shared/components/maintenance/maintenance.component";

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  locationInterval: number;
  splashModal: any;
  me: IUser;
  messageSubscriber: Unsubscribe;

  constructor(private storage: Storage, private translateService: TranslateService, private userService: UserCollectionService,
    private localStorage: LocalStorageService, private router: Router, private locationService: LocationService,
    private modalCtrl: ModalController, private pushService: PushService, private navCtrl: NavController,
    private alertCtrl: AlertController) {
    this.initializeApp();

    this.translateService.onLangChange.subscribe((translation) => {
      if (this.me) {
        this.me._settings.currentLang = translation.lang;
        this.userService.set(this.me.id, this.me);
      }
    });

    const showMaintenance = async () => {
      const modal = await this.modalCtrl.create({
        component: MaintenanceComponent,
        cssClass: 'maintenance-modal'
      });

      return modal.present();
    }

    if (window.location.hostname === 'www.dexxire.com' || window.location.hostname === 'dexxire.com') {
      //showMaintenance();
    }
  }

  async initializeApp() {
    this.storage.get('lang').then(async (language) => {
      const languageCode = await Device.getLanguageCode();
      const prefixes = ['de', 'en', 'fr', 'es'];

      if (language) {
        this.translateService.use(language);
      } else if (prefixes.includes(languageCode.value)) {
        this.translateService.use(languageCode.value);
      }
    });

    this.auth();
  }

  private async auth() {
    this.splashModal = await this.modalCtrl.create({
      component: CustomSplashComponent,
      cssClass: 'customSplash'
    });
    await this.splashModal.present();

    setTimeout(() => {
      this.splashModal.dismiss();
    }, 2500);

    getAuth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let user: IUser = await this.userService.get(firebaseUser.uid);

        this.userService.startObserver(firebaseUser.uid, async (u: IUser) => {
          this.me = u;
          user = u;
          await this.localStorage.setUser(u);

          if (Capacitor.isNativePlatform()) {
            Badge.requestPermissions().then((status) => {
              if (status.display === 'granted') {
                Badge.set({
                  count: ProfileHelper.calculateBadge(user)
                });
              }
            });
          }

          document.dispatchEvent(new CustomEvent('user', {
            detail: {
              user: u
            }
          }));

          if (u?.status === STATUS_PENDING) {
            await this.router.navigate(['/register-steps']);
          }
        });

        if (!user) {
          return;
        }

        let now = new Date().getTime() / 1000;
        user.lastLogin = now;

        await this.userService.set(user.id, user);

        if (user.status === STATUS_ACTIVE) {
          const filter = await this.localStorage.getFilter();

          if (!filter || filter.location?.type === 'currentLocation' || !filter.location) {
            user.currentLocation = await this.locationService.detectCurrentLocation();
          } else if (filter.location && filter.location.type === 'customLocation') {
            user.currentLocation.hash = geohashForLocation([filter.location.currentLocation.lat, filter.location.currentLocation.lng]);
            user.currentLocation.lat = filter.location.currentLocation.lat;
            user.currentLocation.lng = filter.location.currentLocation.lng;
          }
          await this.userService.set(user.id, user);

          await this.localStorage.setUser(user);

          if (!this.router.url.includes('/profile') && !this.router.url.includes('/search') && !this.router.url.includes('/chat')
            && !this.router.url.includes('/home') && !this.router.url.includes('/data-protection') && !this.router.url.includes('/agb')
            && !this.router.url.includes('/backend') && !this.router.url.includes('/support')) {
            await this.navCtrl.navigateRoot('/start-tabs/home');
          }

          if (Capacitor.isNativePlatform()) {
            await this.initNotifications();
          }

          if (!this.me._settings.showInDiscover) {
            this.localStorage.getDiscoverInfo().then(async (info) => {
              if (!info) {
                const alert = await this.alertCtrl.create({
                  message: this.translateService.instant('SHOWINDISCOVERINFO'),
                  buttons: [
                    {
                      text: this.translateService.instant('YES'),
                      handler: () => {
                        this.me._settings.showInDiscover = true;
                        this.userService.set(this.me.id, this.me).then(() => this.localStorage.setDiscoverInfo());
                      }
                    },
                    {
                      text: this.translateService.instant('CANCEL'),
                      role: 'cancel',
                      handler: () => {
                        this.localStorage.setDiscoverInfo();
                      }
                    }
                  ]
                });

                alert.present();
              }
            })
          } else {
            this.localStorage.setDiscoverInfo();
          }
        }
      } else {
        await this.localStorage.setUser(null);
        await this.localStorage.setFilter(null);
        await this.localStorage.setDiscoverInfo(null);
        

        if (Capacitor.isNativePlatform()) {
          if (this.messageSubscriber) {
            this.messageSubscriber();
          }

          Badge.checkPermissions().then((status) => {
            if (status.display === 'granted') {
              Badge.clear();
            }
          });

          this.pushService.removeListeners();
        }

        if (this.me) {
          await this.localStorage.getDeviceId().then((deviceId) => {
            if (deviceId) {
              this.me._deviceIds = this.me._deviceIds.filter((id) => id !== deviceId);
              this.userService.set(this.me.id, this.me);

              return true;
            }

            return false;
          });

          this.me = null;
        }


        if (!this.router.url.includes('/profile') && !this.router.url.includes('/search') && !this.router.url.includes('/chat')
          && !this.router.url.includes('/home/profiling') && !this.router.url.includes('/data-protection') && !this.router.url.includes('/agb')
          && !this.router.url.includes('/support')) {
          await this.navCtrl.navigateRoot('/login');
        }
      }
    });
  }

  private initNotifications() {
    return PushNotifications.requestPermissions().then((status) => {
      if (status.receive === 'granted') {
        FCM.getToken().then((token) => {
          if (!this.me._deviceIds) {
            this.me._deviceIds = [];
          }

          if (!this.me._deviceIds.includes(token.token)) {
            this.localStorage.setDeviceId(token.token);
            this.me._deviceIds.push(token.token);
            this.userService.set(this.me.id, this.me);
          }
        });

        this.pushService.addListeners();
      }
    }).then(() => {
      return PushNotifications.register();
    })
  }
}
