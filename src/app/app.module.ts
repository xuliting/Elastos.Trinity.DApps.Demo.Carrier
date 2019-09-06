import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { Observable } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { zh } from './../assets/i18n/zh';
import { en } from './../assets/i18n/en';

/**provider*/

import { Native } from './services/Native';
import { Logger } from './services/Logger';
import { CarrierManager } from "./services/CarrierManager";
import { PopupProvider } from './services/popup';

/** 通过类引用方式解析国家化文件 */
export class CustomTranslateLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return Observable.create(observer => {
            switch (lang) {
                case 'zh':
                default:
                    observer.next(zh);
                    break;
                case 'en':
                    observer.next(en);
            }

            observer.complete();
        });
    }
}

export function TranslateLoaderFactory() {
    return new CustomTranslateLoader();
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (TranslateLoaderFactory)
            }
        }),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        QRScanner,
        CarrierManager,
        Clipboard,
        Native,
        Logger,
        PopupProvider,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
