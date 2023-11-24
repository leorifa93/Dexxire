import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect} from "firebase/auth";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";
import {UserCollectionService} from "../services/user/user-collection.service";
import {Membership, STATUS_PENDING} from "../constants/User";
import { OAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  screen: string = 'login';
  formData: FormGroup;
  formRegistrationData: FormGroup;
  isPasswordWrong: boolean = false;
  isLoggingIn: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router, private translateService: TranslateService, private alertCtrl: AlertController,
              private userCollectionService: UserCollectionService) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.formRegistrationData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordconfirm: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  changeState(state: string) {
    this.screen = state;
  }

  async createOrSignInUserViaGoogle(formData) {
    const provider = new OAuthProvider('google.com');
    this.signInWithPopup(provider, formData);
  }

  private signInWithPopup(provider, formData) {
    let ui = new firebaseui.auth.AuthUI(getAuth());
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        {
          provider: provider.providerId,
          scopes: [
            'https://www.googleapis.com/auth/contacts.readonly'
          ],
          customParameters: {
            prompt: 'select_account'
          }
        }
      ]
    });
  }
  async createUser(formData: any) {
    this.isLoggingIn = true;

    try {
      if (formData.value.password !== formData.value.passwordconfirm) {
        throw new Error(this.translateService.instant('PASSWORTNOTEQUAL'));
      }
    } catch (err: any) {
      const alert = await this.alertCtrl.create({
        message: err.message
      });

      this.isLoggingIn = false;

      return alert.present();
    }

    createUserWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password).then(async (userCredentials) => {
      this.isLoggingIn = false;

      return this.userCollectionService.set(userCredentials.user.uid, {
        id: userCredentials.user.uid,
        status: STATUS_PENDING,
        membership: Membership.Standard
      });
    }).catch(async (err) => {
      this.isLoggingIn = false;
      const alert = await this.alertCtrl.create({
        message: err.message
      });

      return alert.present();
    });
  }

  login(formData: any) {
    this.isLoggingIn = true;

    signInWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)
      .then((userCredentials) => {
        this.isLoggingIn = false;
      })
      .catch((err) => {
        this.isLoggingIn = false;
        this.isPasswordWrong = true;
      });
  }

  showPage(page: string) {
    this.router.navigate(['/' + page]);
  }
}
