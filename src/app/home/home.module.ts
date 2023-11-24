import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {UserCardModule} from "../_shared/components/user-card/user-card.module";
import {SwipeControlsModule} from "../_shared/components/swipe-controls/swipe-controls.module";
import {LazyLoadImageModule} from "ng-lazyload-image";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    UserCardModule,
    SwipeControlsModule,
    LazyLoadImageModule
  ],
  declarations: [HomePage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomePageModule {}
