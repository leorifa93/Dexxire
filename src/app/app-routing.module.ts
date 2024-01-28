import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register-steps',
    loadChildren: () => import('./register-steps/register-steps.module').then( m => m.RegisterStepsPageModule)
  },
  {
    path: 'start-tabs',
    loadChildren: () => import('./start-tabs/start-tabs.module').then( m => m.StartTabsPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  },
  {
    path: 'profile',
    children: [
      {
        path: ':userId',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {

        path: ':lang/:country/:federaleState/:city/:category/:userId',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      }
    ]
  },
  {
    path: 'search',
    children: [
      {
        path: '',
        loadChildren: () => import('./discover/search/search.module').then( m => m.SearchPageModule)

      },
      {
        path: ':lang/:country/:federaleState/:city/:category',
        loadChildren: () => import('./discover/search/search.module').then( m => m.SearchPageModule)

      }
    ]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'chat',
    children: [
      {
        path: ':userId',
        loadChildren: () => import('./chats/chat/chat.module').then( m => m.ChatPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
