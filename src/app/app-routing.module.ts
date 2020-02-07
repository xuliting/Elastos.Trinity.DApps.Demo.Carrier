import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'tabs', pathMatch: 'full' },
    { path: 'initialize', loadChildren: './pages/initialize/initialize.module#InitializePageModule' },
    { path: 'friends', loadChildren: './pages/friends/friends.module#FriendsPageModule' },
    { path: 'addfriend', loadChildren: './pages/friends/addfriend/addfriend.module#AddFriendPageModule' },
    { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
    { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
    { path: 'chat', loadChildren: './pages/chat/chat.module#ChatPageModule' },
    { path: 'my', loadChildren: './pages/my/my.module#MyPageModule' },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
