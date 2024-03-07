import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackendPageRoutingModule } from './backend-routing.module';

import { BackendPage } from './backend.page';
import { TranslateModule } from '@ngx-translate/core';
import { ImageProofComponent } from './image-proof/image-proof.component';
import { ProvementComponent } from './image-proof/components/provement/provement.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackendPageRoutingModule,
    TranslateModule
  ],
  declarations: [BackendPage, ImageProofComponent, ProvementComponent]
})
export class BackendPageModule {}
