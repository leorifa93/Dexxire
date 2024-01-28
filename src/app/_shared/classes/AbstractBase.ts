import {IUser} from "../../interfaces/i-user";
import {LocalStorageService} from "../services/local-storage.service";
import {NavController} from "@ionic/angular";
import {ChangeDetectorRef} from "@angular/core";

export class AbstractBase {
  protected user: IUser;
  protected userCallBack: any;
  protected afterUserLoaded: any;
  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    this.localStorage.getUser().then(user => {
      this.user = user;

      if (this.afterUserLoaded) {
        this.afterUserLoaded();
      }
    });
    this.registerEvents();
  }

  protected registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;

      if (this.userCallBack) {
        this.userCallBack();
      }

      this.changeDetector.detectChanges();
    })
  }

  protected goBack() {
    this.navCtrl.pop();
  }
}
