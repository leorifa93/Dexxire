import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import {UserCardModule} from "../../_shared/components/user-card/user-card.module";
import {SwipeControlsModule} from "../../_shared/components/swipe-controls/swipe-controls.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchPageRoutingModule,
        UserCardModule,
        SwipeControlsModule,
        TranslateModule
    ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
