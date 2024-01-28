import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MenuPageRoutingModule} from './menu-routing.module';

import {MenuPage} from './menu.page';
import {TranslateModule} from "@ngx-translate/core";
import {LanguagesModule} from "../_shared/components/languages/languages.module";
import {AgePipeModule} from "../_shared/pipes/age.pipe.module";
import {LazyLoadImageModule} from "ng-lazyload-image";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    TranslateModule,
    LanguagesModule,
    AgePipeModule,
    LazyLoadImageModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {
}
