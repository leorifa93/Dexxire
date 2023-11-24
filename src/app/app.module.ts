import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {initializeAuth, indexedDBLocalPersistence} from "firebase/auth";
import {initializeApp} from "firebase/app";
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Capacitor} from "@capacitor/core";
import {environment} from "../environments/environment";
import {Storage} from "@ionic/storage";
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {IonicStorageModule} from "@ionic/storage-angular";
import {CustomSplashComponent} from "./_shared/components/custom-splash/custom-splash.component";

const app = initializeApp(environment.firebaseConfig);

if (Capacitor.isNativePlatform()) {
  initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
}


@NgModule({
  declarations: [AppComponent, CustomSplashComponent],
  imports: [BrowserModule, IonicModule.forRoot(
    {
      mode: 'ios'
    }
  ), AppRoutingModule, TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    },
    defaultLanguage: 'en'
  }), HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, Storage, TranslateService, TranslateStore],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
