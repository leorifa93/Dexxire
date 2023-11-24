import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import {TranslateModule} from "@ngx-translate/core";
import {LanguagesModule} from "../_shared/components/languages/languages.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MenuPageRoutingModule,
        TranslateModule,
        LanguagesModule
    ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
