import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from './services/AppService';
import { CarrierService } from './services/CarrierService';
import { Native } from './services/Native';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
            private platform: Platform,
            private splashScreen: SplashScreen,
            private statusBar: StatusBar,
            private translate: TranslateService,
            private native: Native,
            private router: Router,
            private carrierManager: CarrierService,
            private appService: AppService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.carrierManager.init();
            this.appService.init();

            this.router.navigate(['/initialize']);
        });
    }
}
