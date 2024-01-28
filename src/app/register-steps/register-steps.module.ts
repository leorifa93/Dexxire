import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterStepsPageRoutingModule } from './register-steps-routing.module';

import { RegisterStepsPage } from './register-steps.page';
import {TranslateModule} from "@ngx-translate/core";
import {LocationPageModule} from "../_shared/pages/location/location.module";
import {AvatarsModule} from "../_shared/components/avatars/avatars.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegisterStepsPageRoutingModule,
        TranslateModule,
      LocationPageModule,
       AvatarsModule
    ],
  declarations: [RegisterStepsPage]
})
export class RegisterStepsPageModule {}
