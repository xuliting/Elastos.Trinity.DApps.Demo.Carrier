import { Component } from '@angular/core';
import { CarrierService } from '../../services/CarrierService';

@Component({
    selector: 'app-my',
    templateUrl: 'my.page.html',
    styleUrls: ['my.page.scss']
})
export class MyPage {

    qrcode = '';

    constructor(public carrierService: CarrierService) {}

    ngOnInit() {
        this.qrcode = this.carrierService.getAddress();
    }
}
