import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'access',
    loadChildren: () => import('./access/access.module').then( m => m.AccessPageModule)
  },
  {
    path: 'data-protection',
    loadChildren: () => import('./data-protection/data-protection.module').then( m => m.DataProtectionPageModule)
  },
  {
    path: 'agb',
    loadChildren: () => import('./agb/agb.module').then( m => m.AgbPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
