import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { MyQrcodeComponent } from './my-qrcode/my-qrcode.component'

@NgModule({
    declarations: [HeaderBarComponent, MyQrcodeComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        QRCodeModule,
        TranslateModule,
    ],
    exports: [HeaderBarComponent, MyQrcodeComponent],
    providers: [
    ],
    entryComponents: [],
})
export class ComponentsModule { }
