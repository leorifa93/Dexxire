import { Component, OnInit } from '@angular/core';
import {isPlatform, ModalController, NavController, ToastController} from "@ionic/angular";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {IUser} from "../../interfaces/i-user";
import {LocationPage} from "../../_shared/pages/location/location.page";
import {UserCollectionService} from "../../services/user/user-collection.service";
import {UserService} from "../../services/user/user.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import { App } from '@capacitor/app';
import {Gender} from "../../constants/User";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: IUser;
  versionNumber: string = '0.0.0';
  currentLang: string;
  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]
  constructor(private navCtrl: NavController, private localStorage: LocalStorageService,
              private modalCtrl: ModalController, private userCollectionService: UserCollectionService,
              private userService: UserService, private toastCtrl: ToastController, private translateService: TranslateService,
              private router: Router) {
    this.currentLang = this.translateService.currentLang;
    this.localStorage.getUser().then((user) => {
      this.user = user;
    });

    if (isPlatform('capacitor')) {
      App.getInfo().then((info) => {
        this.versionNumber = info.version;
      })
    }
  }

  ngOnInit() {
    document.addEventListener('lang', (e: any) => {
      this.currentLang = e.detail.lang;
    })
  }

  async goBack(save: boolean = false) {
    if (save) {
      this.userCollectionService.set(this.user.id, this.user).then(async () => {
        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('SETTINGSAVED'),
          duration: 2000
        });

        return toast.present();
      })
    }

    return this.navCtrl.pop();
  }

  logout() {
    return this.userService.signOut();
  }

  selectGenderFor(gender: Gender) {
    if (!this.user.genderLookingFor) {
      this.user.genderLookingFor = [];
    }

    if (this.user.genderLookingFor.includes(gender)) {
      this.user.genderLookingFor.splice(this.user.genderLookingFor.indexOf(gender), 1);
    } else {
      this.user.genderLookingFor.push(gender);
    }

    document.dispatchEvent(new CustomEvent('user', {
      detail: {
        user: this.user
      }
    }));
  }


  showAccess() {
    return this.router.navigate(['menu/settings/access']);
  }

  showLanguages() {
    this.navCtrl.navigateForward('menu/languages');
  }
}