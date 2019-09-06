import { Component } from '@angular/core';
import { CarrierManager } from '../../services/CarrierManager';

@Component({
    selector: 'app-my',
    templateUrl: 'my.page.html',
    styleUrls: ['my.page.scss']
})
export class MyPage {

    qrcode: string = "";

    constructor(public carrierManager: CarrierManager) {}

    ngOnInit() {
        this.qrcode = this.carrierManager.getAddress();
    }
}
