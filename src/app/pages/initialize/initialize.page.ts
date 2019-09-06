import { Component, OnInit, NgZone } from '@angular/core';
import { Events } from '@ionic/angular';
import { Native } from '../../services/Native';
import { CarrierManager } from '../../services/CarrierManager';

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
            private carrierManager: CarrierManager) {
    }

    ngOnInit() {
        this.native.showLoading("Connecting to carrier").then(() => {
            this.initializeApp();
        });
    }

    initializeApp() {
        if (this.carrierManager.isReady()) {
            this.native.hideLoading();
            this.native.setRootRouter("/tabs");
            return;
        }

        this.events.subscribe('carrier:ready', msg => {
            this.zone.run(() => {
                this.native.hideLoading();
                this.native.setRootRouter("/tabs");
            });
        });
    }
}
