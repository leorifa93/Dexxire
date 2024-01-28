import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import {TranslateModule} from "@ngx-translate/core";
import {LazyLoadImageModule} from "ng-lazyload-image";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatPageRoutingModule,
        TranslateModule,
        LazyLoadImageModule
    ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
