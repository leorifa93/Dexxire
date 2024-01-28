import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractBase} from "../../../_shared/classes/AbstractBase";
import {LocalStorageService} from "../../../_shared/services/local-storage.service";
import {AlertController, NavController, ToastController} from "@ionic/angular";
import {deleteUser, getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail, signOut} from "firebase/auth";
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
})
export class AccessPage extends AbstractBase implements OnInit {
  showAccess: boolean = true;
  accessData: FormGroup;
  email: string;

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef, private alertCtrl: AlertController,
              private translateService: TranslateService, private fb: FormBuilder, private toastCtrl: ToastController) {
    super(localStorage, navCtrl, changeDetector);

    const auth = getAuth();
    this.email = auth.currentUser.email;

    this.accessData = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]]
    });

    for (let userInfo of auth.currentUser.providerData) {
      if (['apple.com', 'google.com', 'facebook.com'].includes(userInfo.providerId)) {
        this.showAccess = false;
      }
    }
  }

  ngOnInit() {
  }

  async removeAcc() {
    const alert = await this.alertCtrl.create({
      message: this.translateService.instant('AREYOUSURE'),
      buttons: [
        {
          text: this.translateService.instant('YES'),
          handler: () => {
            const auth = getAuth();
            const user = auth.currentUser;

            return deleteUser(user);
          }
        },
        {
          text: this.translateService.instant('CANCEL'),
          role: 'CANCEL'
        }
      ]
    });

    return alert.present();
  }

  updateUserEmail(formData) {
    const auth = getAuth();
    const user = auth.currentUser;

    signOut(auth).then(() => {
      return verifyBeforeUpdateEmail(user, formData.value.email).then(async () => {
        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('EMAILCHANGED'),
          duration: 2000
        });

        return toast.present();
      })
    });
  }

  resetPassword() {
    return sendPasswordResetEmail(getAuth(), this.email)
      .then(async () => {

        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('EMAILSENT'),
          duration: 2000
        });

        return toast.present();
      });
  }
}
