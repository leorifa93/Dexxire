import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {LocalStorageService} from "../../_shared/services/local-storage.service";

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  languages: any[] = [
    {key: 'de', flag: 'https://flagsapi.com/DE/flat/32.png', isChecked: false},
    {key: 'en', flag: 'https://flagsapi.com/US/flat/32.png', isChecked: false},
    {key: 'fr', flag: 'https://flagsapi.com/FR/flat/32.png', isChecked: false},
    {key: 'es', flag: 'https://flagsapi.com/ES/flat/32.png', isChecked: false}
  ]

  constructor(private navCtrl: NavController, private translateService: TranslateService, private localStorage: LocalStorageService) {
    for (let language of this.languages) {
      if (language.key === this.translateService.currentLang) {
        language.isChecked = true;
      }
    }
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.pop();
  }

  changeLanguage(lang: 'de' | 'en' | 'fr' | 'es') {
    for (let language of this.languages) {
      if (language.key === lang) {
        language.isChecked = true;
      } else {
        language.isChecked = false;
      }
    }

    this.translateService.use(lang);
    this.localStorage.setLang(lang);

    document.dispatchEvent(new CustomEvent('lang', {
      detail: {
        lang: lang
      }
    }));
  }
}
