import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user/user.service";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {IUser} from "../interfaces/i-user";
import {LocationService} from "../_shared/services/location.service";
import {ProfileHelper} from "../_shared/helper/Profile";
import {EditComponent} from "../profile/components/edit/edit.component";
import {ModalController, NavController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {LocationPage} from "../_shared/pages/location/location.page";
import {UserCollectionService} from "../services/user/user-collection.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  user: IUser;
  currentCity: string;
  currentLang: string;

  constructor(private userService: UserService, private localStorage: LocalStorageService, private locationService: LocationService,
              private modalCtrl: ModalController, private translateService: TranslateService, private navCtrl: NavController,
              private userCollectionService: UserCollectionService) {
    this.currentLang = this.translateService.currentLang;
    this.localStorage.getUser().then((user) => {
      this.user = user

      this.locationService.getCityFromLatLng(
        this.user.currentLocation.lat,
        this.user.currentLocation.lng
      ).then((formatAddress: any) => {
        this.currentCity = formatAddress[0].locality + ', ' + formatAddress[0].state;
      })
    });
  }

  ngOnInit() {
    this.registerEvents();
  }

  logout() {
    return this.userService.signOut();
  }

  registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    })

    document.addEventListener('lang', (e: any) => {
      this.currentLang = e.detail.lang;
    })
  }

  getPercentOfUserDetails() {
    if (this.user) {
      return ProfileHelper.getPercentOfUserDetails(this.user);
    }

    return 0;
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditComponent,
      componentProps: {
        user: this.user
      }
    });

    modal.present();
  }

  showLanguages() {
    this.navCtrl.navigateForward('menu/languages');
  }

  showProfile() {
    this.userService.showProfile(this.user, this.user);
  }

  showSettings() {
    this.navCtrl.navigateForward('menu/settings');
  }

  showSubscriptions() {
    this.navCtrl.navigateForward('menu/subscriptions');
  }

  showShop() {
    this.navCtrl.navigateForward('menu/shop');
  }

  async showLocations() {
    const modal = await this.modalCtrl.create({
      component: LocationPage
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.user.location = {
          location: result.data.location.description,
          placeId: result.data.placeId
        }


        this.userCollectionService.set(this.user.id, this.user);
      }
    })

    return modal.present();
  }
}
