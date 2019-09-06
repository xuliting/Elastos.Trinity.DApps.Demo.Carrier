import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      },
      {
        path: 'my',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../my/my.module').then(m => m.MyPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/friends',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/friends',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
