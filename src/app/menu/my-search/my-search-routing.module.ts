import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySearchPage } from './my-search.page';

const routes: Routes = [
  {
    path: '',
    component: MySearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySearchPageRoutingModule {}
