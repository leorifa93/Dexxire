import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {LazyLoadImageModule} from "ng-lazyload-image";
import {VipBannerModule} from "../_shared/components/vip-banner/vip-banner.module";
import {AgePipeModule} from "../_shared/pipes/age.pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {SwipeControlsModule} from "../_shared/components/swipe-controls/swipe-controls.module";
import {TextBannerModule} from "../_shared/components/text-banner/text-banner.module";
import {EditComponent} from "./components/edit/edit.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        LazyLoadImageModule,
        VipBannerModule,
        AgePipeModule,
        TranslateModule,
        SwipeControlsModule,
        TextBannerModule
    ],
  declarations: [ProfilePage, EditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [EditComponent]
})
export class ProfilePageModule {}
