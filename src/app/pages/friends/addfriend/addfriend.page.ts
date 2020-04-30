import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Native } from '../../../services/Native';
import { AppService } from '../../../services/AppService';
import { CarrierService } from '../../../services/CarrierService';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-addfriend',
    templateUrl: 'addfriend.page.html',
    styleUrls: ['addfriend.page.scss']
})
export class AddFriendPage {

    private items = [{'online':true, 'label':'label', 'uid':'uid'}, {'online':false, 'label':'label', 'uid':'uid'}];
    address: string = "";
    friendRequest: string = "Hello";

    constructor(
            private route: ActivatedRoute,
            private platform: Platform,
            private native: Native,
            private appService: AppService,
            private carrierService: CarrierService) {
        this.route.queryParams.subscribe((data) => {
            this.address = data["address"];
        });
    }

    ionViewWillEnter() {
        titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    }

    addFriend() {
        console.log("AddFriend:" + this.address);
        if (this.platform.is("desktop")) { //for test
            this.carrierService.addFriend(this.address, "Hello",
                () => {
                    console.log("AddFriend success");
                    this.native.setRootRouter("/tabs");
                },
                null);
        } else {
            this.carrierService.isValidAddress(this.address,
            (data) => {
                if (data) {
                    this.carrierService.addFriend(this.address, this.friendRequest,
                        () => {
                            console.log("AddFriend success");
                            this.native.setRootRouter("/tabs");
                        },
                        (err) => {
                            console.log("AddFriend error: " + err);
                        });
                } else {
                    this.native.toast("address error!");
                }
            },
            null);
        }
    }

    scanCode() {
        this.appService.scanAddress();
    }

}
