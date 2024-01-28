import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockedPageRoutingModule } from './blocked-routing.module';

import { BlockedPage } from './blocked.page';
import {TranslateModule} from "@ngx-translate/core";
import {ListModule} from "../components/list/list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockedPageRoutingModule,
    TranslateModule,
    ListModule
  ],
  declarations: [BlockedPage]
})
export class BlockedPageModule {}
