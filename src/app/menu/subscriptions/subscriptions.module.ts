import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionsPageRoutingModule } from './subscriptions-routing.module';

import { SubscriptionsPage } from './subscriptions.page';
import {TranslateModule} from "@ngx-translate/core";
import {AbonnementsModule} from "../../_shared/components/abonnements/abonnements.module";
import {CongratulationsModule} from "../../_shared/components/congratulations/congratulations.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SubscriptionsPageRoutingModule,
        TranslateModule,
        AbonnementsModule,
        CongratulationsModule
    ],
  declarations: [SubscriptionsPage]
})
export class SubscriptionsPageModule {}
