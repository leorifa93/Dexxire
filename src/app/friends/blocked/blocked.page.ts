import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractBase} from "../../_shared/classes/AbstractBase";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.page.html',
  styleUrls: ['./blocked.page.scss'],
})
export class BlockedPage extends AbstractBase implements OnInit {

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
  }

}
