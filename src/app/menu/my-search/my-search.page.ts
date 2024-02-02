import {Component, OnInit} from '@angular/core';
import {Gender} from "../../constants/User";
import {IUser} from "../../interfaces/i-user";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {UserCollectionService} from "../../services/user/user-collection.service";
import {UserService} from "../../services/user/user.service";
import {NavController, ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-my-search',
  templateUrl: './my-search.page.html',
  styleUrls: ['./my-search.page.scss'],
})
export class MySearchPage implements OnInit {

  user: IUser;
  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]

  constructor(private localStorage: LocalStorageService, private userCollectionService: UserCollectionService,
              private userService: UserService, private toastCtrl: ToastController, private translateService: TranslateService,
              private navCtrl: NavController) {
    this.localStorage.getUser().then((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

  async goBack(save: boolean = false) {
    if (save) {
      return this.userCollectionService.set(this.user.id, this.user);
    }

    return this.navCtrl.pop();
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
}
