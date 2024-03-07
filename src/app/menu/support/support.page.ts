import { Component, OnInit } from '@angular/core';
import { AbstractBase } from 'src/app/_shared/classes/AbstractBase';
import {NavController} from "@ionic/angular";
import {ChangeDetectorRef} from "@angular/core";
import { LocalStorageService } from 'src/app/_shared/services/local-storage.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage extends AbstractBase implements OnInit {

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
    protected changeDetector: ChangeDetectorRef) { 
      super(localStorage, navCtrl, changeDetector);
    }

  ngOnInit() {
  }

}
