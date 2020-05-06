import { Component, OnInit, NgZone } from '@angular/core';
import { Events, ModalController } from '@ionic/angular';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { Native } from '../../services/Native';
import { CarrierService } from '../../services/CarrierService';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-initialize',
    templateUrl: './initialize.page.html',
    styleUrls: ['./initialize.page.scss'],
})
export class InitializePage implements OnInit {
    constructor(
            private native: Native,
            private events: Events,
            private zone: NgZone,
            private modalCtrl: ModalController,
            private carrierService: CarrierService) {
    }

    ngOnInit() {
        this.showLoading('Connecting to Carrier').then(() => {
            this.initializeApp();
        });
        // this.native.setRootRouter('/tabs');
    }

    async showLoading(message) {
        const loading = await this.modalCtrl.create({
            component: LoadingComponent,
            componentProps: {
                message
            },
            backdropDismiss: false,
            // cssClass: 'loading-modal'
        });
        loading.onDidDismiss().then((params) => {
            console.log('onDidDismiss');
        });

        return await loading.present();
    }

    hideLoading() {
        this.modalCtrl.dismiss();
    }

    ionViewWillEnter() {
        titleBarManager.setTitle("Carrier Demo");
        titleBarManager.setBackgroundColor("#181d20");
        titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
        titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    }

    ionViewDidEnter() {
        appManager.setVisible("show", () => {}, (err) => {});
    }

    initializeApp() {
        if (this.carrierService.isReady()) {
            this.hideLoading();
            this.native.setRootRouter('/tabs');
            return;
        }

        this.events.subscribe('carrier:ready', msg => {
            this.zone.run(() => {
                this.hideLoading();
                this.native.setRootRouter('/tabs');
            });
        });
    }
}
