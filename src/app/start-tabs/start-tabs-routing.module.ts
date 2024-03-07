import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartTabsPage } from './start-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: StartTabsPage,
    children: [
      {
        path: 'profiling',
        children: [
          {
            path: ':lang/:country/:federaleState/:city',
            loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () => import('./../menu/menu.module').then(m => m.MenuPageModule)
          }
        ]
      },
      {
        path: 'chats',
        children: [
          {
            path: '',
            loadChildren: () => import('./../chats/chats.module').then(m => m.ChatsPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: () => import('./../discover/discover.module').then(m => m.DiscoverPageModule)
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () => import('./../friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartTabsPageRoutingModule {}
