import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent  implements OnInit {

  public activeLanguage: string = 'en';
  constructor(private translateService: TranslateService, private storage: Storage) { }

  ngOnInit() {
    setTimeout(() => {
      this.activeLanguage = this.translateService.currentLang;
    }, 1000);
  }


  changeLanguage(lang: 'de' | 'en' | 'fr' | 'es') {
    this.activeLanguage = lang;
    this.translateService.use(lang);
    this.storage.set('language', lang);
  }
}
