import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import {TranslateModule} from "@ngx-translate/core";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {TimeAgoModule} from "../_shared/pipes/time-ago.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    TranslateModule,
    LazyLoadImageModule,
    TimeAgoModule
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
