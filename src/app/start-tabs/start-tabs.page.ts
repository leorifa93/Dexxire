import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {IonTabs, ModalController, NavController} from "@ionic/angular";
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-start-tabs',
  templateUrl: './start-tabs.page.html',
  styleUrls: ['./start-tabs.page.scss'],
})
export class StartTabsPage extends AbstractBase implements OnInit {

  loginModal: any;
  showBackdrop: boolean = false;

  @ViewChild('startTabs') tabRef: IonTabs
  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef, private router: Router, private modalCtrl: ModalController) {
    super(localStorage, navCtrl, changeDetector)
  }

  ngOnInit() {
    document.addEventListener('showBackdrop', (ev: any) => this.showBackdrop = ev.detail.showBackdrop);
    document.addEventListener('user', async (e: any) => {
      if (this.loginModal) {
        this.loginModal.dismiss();
      }
    })
  }

  ngAfterViewInit() {
    if (!this.router.url.includes('/home/profiling')) {
      this.tabRef.select('home');
    }
  }

  async showLogin() {
    this.loginModal = await this.modalCtrl.create({
      component: LoginPage,
      cssClass: 'login-modal',
      backdropDismiss: false
    });

    this.loginModal.present();
  }
}
