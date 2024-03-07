import { Component, OnInit } from '@angular/core';
import { AbstractBase } from '../_shared/classes/AbstractBase';
import {NavController} from "@ionic/angular";
import {ChangeDetectorRef} from "@angular/core";
import { LocalStorageService } from '../_shared/services/local-storage.service';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.page.html',
  styleUrls: ['./backend.page.scss'],
})
export class BackendPage extends AbstractBase implements OnInit {

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
    protected changeDetector: ChangeDetectorRef) {
      super(localStorage, navCtrl, changeDetector);
     }

  ngOnInit() {
  }

}
