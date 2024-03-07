import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractBase } from 'src/app/_shared/classes/AbstractBase';
import {NavController} from "@ionic/angular";
import {ChangeDetectorRef} from "@angular/core";
import { LocalStorageService } from 'src/app/_shared/services/local-storage.service';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.page.html',
  styleUrls: ['./data-protection.page.scss'],
})
export class DataProtectionPage extends AbstractBase implements OnInit {

  currentLang: string;

  constructor(private translate: TranslateService, protected localStorage: LocalStorageService, protected navCtrl: NavController,
    protected changeDetector: ChangeDetectorRef) { 
      super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
    setTimeout(() => {
      this.currentLang = this.translate.currentLang;
      this.changeDetector.detectChanges();
    }, 1000);
  }

}
