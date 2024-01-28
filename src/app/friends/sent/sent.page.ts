import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractBase} from "../../_shared/classes/AbstractBase";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-sent',
  templateUrl: './sent.page.html',
  styleUrls: ['./sent.page.scss'],
})
export class SentPage extends AbstractBase implements OnInit {

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
  }

}
