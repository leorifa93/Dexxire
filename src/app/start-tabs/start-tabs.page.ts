import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {IonTabs, NavController} from "@ionic/angular";
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {LocalStorageService} from "../_shared/services/local-storage.service";

@Component({
  selector: 'app-start-tabs',
  templateUrl: './start-tabs.page.html',
  styleUrls: ['./start-tabs.page.scss'],
})
export class StartTabsPage extends AbstractBase implements OnInit {

  @ViewChild('startTabs') tabRef: IonTabs
  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector)
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tabRef.select('home');
  }
}
