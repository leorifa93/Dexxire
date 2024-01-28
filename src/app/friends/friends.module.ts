import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import {TranslateModule} from "@ngx-translate/core";
import {ListModule} from "./components/list/list.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule,
    TranslateModule,
    ListModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
