import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFriendPage } from './addfriend.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddFriendPage }])
  ],
  declarations: [AddFriendPage]
})
export class AddFriendPageModule {}
