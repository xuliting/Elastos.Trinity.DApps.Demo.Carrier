import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../services/AppService';
import { CarrierManager } from '../../services/CarrierManager';

@Component({
    selector: 'header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
    public back_touched = false;
    public _title: string = '';

    @Input()
    set title(title: string) {
        this._title = title;
    }

    constructor(public appService: AppService, public carrierManager: CarrierManager) { }

    ngOnInit() { }

    launcher() {
        this.appService.launcher();
    }

    close() {
        console.log("close");
        this.carrierManager.destroyCarrier();
        this.appService.close();
    }
}
