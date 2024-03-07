import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataProtectionPageRoutingModule } from './data-protection-routing.module';

import { DataProtectionPage } from './data-protection.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataProtectionPageRoutingModule,
    TranslateModule
  ],
  declarations: [DataProtectionPage]
})
export class DataProtectionPageModule {}
