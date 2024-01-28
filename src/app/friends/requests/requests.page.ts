import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";
import {AbstractBase} from "../../_shared/classes/AbstractBase";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage extends AbstractBase implements OnInit {

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
  }

}
