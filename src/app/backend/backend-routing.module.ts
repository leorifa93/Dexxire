import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackendPage } from './backend.page';

const routes: Routes = [
  {
    path: '',
    component: BackendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackendPageRoutingModule {}
