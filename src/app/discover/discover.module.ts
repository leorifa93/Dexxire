import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import {TranslateModule} from "@ngx-translate/core";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {UserCardModule} from "../_shared/components/user-card/user-card.module";
import {AbonnementsModule} from "../_shared/components/abonnements/abonnements.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DiscoverPageRoutingModule,
        TranslateModule,
        LazyLoadImageModule,
        UserCardModule,
        AbonnementsModule
    ],
  declarations: [DiscoverPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiscoverPageModule {}
