import {Component} from '@angular/core';
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";
import {getAuth} from "firebase/auth";
import {UserCollectionService} from "./services/user/user-collection.service";
import {IUser} from "./interfaces/i-user";
import {LocalStorageService} from "./_shared/services/local-storage.service";
import {Capacitor} from "@capacitor/core";
import {Router} from "@angular/router";
import {Device} from '@capacitor/device';
import {STATUS_ACTIVE, STATUS_PENDING} from "./constants/User";
import {LocationService} from "./_shared/services/location.service";
import {ModalController} from "@ionic/angular";
import {CustomSplashComponent} from "./_shared/components/custom-splash/custom-splash.component";
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  locationInterval: number;
  splashModal: any;
  constructor(private storage: Storage, private translateService: TranslateService, private userService: UserCollectionService,
              private localStorage: LocalStorageService, private router: Router, private locationService: LocationService,
              private modalCtrl: ModalController) {
    this.initializeApp();
  }

  async initializeApp() {
    this.storage.get('language').then(async (language) => {
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
        const user: IUser = await this.userService.get(firebaseUser.uid);

        if (!user) {
          await this.router.navigate(['/register-steps']);
          await this.localStorage.setUser(null);
          return;
        }

        user.lastLogin = Date.now();
        await this.localStorage.setUser(user);

        if (user.status === STATUS_ACTIVE) {

          if (Capacitor.isNativePlatform()) {
            this.locationInterval = window.setInterval(async () => {
              user.currentLocation = await this.locationService.detectCurrentLocation();
              await this.userService.set(user.id, user);
            }, 10000);
          }

          await this.localStorage.setUser(user);
          await this.router.navigate(['/start-tabs']);
        } else if (user.status === STATUS_PENDING) {
          await this.router.navigate(['/register-steps']);
        }
      } else {
        await this.localStorage.setUser(null);

        if (!isNaN(this.locationInterval)) {
          clearInterval(this.locationInterval);
        }
        await this.router.navigate(['/login']);
      }
    });
  }
}
