import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FacebookAuthProvider, OAuthProvider, signInWithCredential, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {AlertController, isPlatform, ToastController} from "@ionic/angular";
import {UserCollectionService} from "../services/user/user-collection.service";
import {Membership, STATUS_PENDING} from "../constants/User";
import * as firebaseui from "firebaseui";
import {environment} from "../../environments/environment";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {
  SignInWithApple,
  SignInWithAppleResponse,
} from '@capacitor-community/apple-sign-in';
import {FacebookLogin, FacebookLoginResponse} from "@capacitor-community/facebook-login";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  screen: string = 'login';
  formData: FormGroup;
  formRegistrationData: FormGroup;
  resetData: FormGroup;
  isPasswordWrong: boolean = false;
  isLoggingIn: boolean = false;
  showAppleLogin: boolean = false;
  passwordFieldType: string = 'password';

  constructor(private fb: FormBuilder,
              private router: Router, private translateService: TranslateService, private alertCtrl: AlertController,
              private userCollectionService: UserCollectionService, private toastCtrl: ToastController) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.formRegistrationData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordconfirm: ['', [Validators.required]],
    });

    this.resetData = this.fb.group(({
      email: ['', [Validators.required, Validators.email]],
    }));

    if (!isPlatform('capacitor')) {
      GoogleAuth.init();
    }

    if ((isPlatform('ios') && isPlatform('capacitor')) || !isPlatform('capacitor')) {
      this.showAppleLogin = true;
    }
  }

  async ngOnInit() {
    await FacebookLogin.initialize({ appId: environment.fbAppId, xfbml: true, version: 'v18.0' });
  }

  changeState(state: string) {
    this.passwordFieldType = 'password';
    this.screen = state;
  }

  togglePassword(id: string) {
    const passwordEL: any = document.getElementById(id);

    if (passwordEL.type === "password") {
      this.passwordFieldType = "text";
    } else {
      this.passwordFieldType = "password";
    }
  }
  async createOrSignInUserViaGoogle() {
    const user = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken);

    return signInWithCredential(getAuth(), credential).then((userCredential) => {
      this.userCollectionService.get(userCredential.user.uid).then((u) => {
        if (!u) {
          this.userCollectionService.set(userCredential.user.uid, {
            id: userCredential.user.uid,
            status: STATUS_PENDING,
            membership: Membership.Standard,
            isVerified: true
          });
        }
      });
    });
  }

  createOrSignInViaApple() {
    SignInWithApple.authorize({
      clientId: environment.appleClientId,
      redirectURI: window.location.origin
    })
      .then((result: SignInWithAppleResponse) => {
        const credential = new OAuthProvider('apple.com').credential({
          idToken: result.response.identityToken
        })

        return signInWithCredential(getAuth(), credential).then((userCredential) => {
          this.userCollectionService.get(userCredential.user.uid).then((u) => {
            if (!u) {
              this.userCollectionService.set(userCredential.user.uid, {
                id: userCredential.user.uid,
                status: STATUS_PENDING,
                membership: Membership.Standard,
                isVerified: true
              });
            }
          });
        });
      })
      .catch(error => {
        // Handle error
      });
  }

  async createOrSignInViaFacebook() {
    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })

    if (result.accessToken) {
      const credential = FacebookAuthProvider.credential(result.accessToken.token);

      return signInWithCredential(getAuth(), credential).then((userCredential) => {
        this.userCollectionService.get(userCredential.user.uid).then((u) => {
          if (!u) {
            this.userCollectionService.set(userCredential.user.uid, {
              id: userCredential.user.uid,
              status: STATUS_PENDING,
              membership: Membership.Standard,
              isVerified: true
            });
          }
        });
      });
    }
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
      }).then(() => {
        return sendEmailVerification(userCredentials.user, {
          url: environment.handleEmailVerification + '?userId=' + userCredentials.user.uid
        });
      })
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

  resetPassword(formData: any) {
    this.isLoggingIn = true;

    sendPasswordResetEmail(getAuth(), formData.value.email)
      .then(async () => {
        this.isLoggingIn = false;

        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('EMAILSENT'),
          duration: 2000
        });

        return toast.present();
      });
  }

  showPrivacy() {
    return this.router.navigate(['/data-protection']);
  }

  showTerms() {
    return this.router.navigate(['/agb']);
  }
}
