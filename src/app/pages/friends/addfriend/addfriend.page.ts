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
      titleBarManager.setTitle("Add Contact");
        this.appService.setTitleBarBackKeyShown(true);
    }

    ionViewWillLeave() {
        this.appService.setTitleBarBackKeyShown(false);
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
                    console.log('Address is valid');
                    this.carrierService.addFriend(this.address, this.friendRequest,
                        () => {
                            console.log("AddFriend success");
                            this.native.setRootRouter("/tabs");
                        },
                        (err) => {
                            console.log("AddFriend error: " + err);
                            this.native.toast(err);
                        });
                } else {
                    this.native.toast("Please check your address");
                }
            },
            null);
        }
    }

    scanCode() {
        this.appService.scanAddress();
    }

}
