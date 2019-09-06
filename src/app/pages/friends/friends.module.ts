import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FriendsPage }])
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
