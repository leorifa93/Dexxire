import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartTabsPageRoutingModule } from './start-tabs-routing.module';

import { StartTabsPage } from './start-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartTabsPageRoutingModule
  ],
  declarations: [StartTabsPage]
})
export class StartTabsPageModule {}
