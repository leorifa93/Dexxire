import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';
import {TranslateModule} from "@ngx-translate/core";
import {ListModule} from "../components/list/list.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RequestsPageRoutingModule,
        TranslateModule,
        ListModule
    ],
  declarations: [RequestsPage]
})
export class RequestsPageModule {}
