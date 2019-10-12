import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Native } from '../../../services/Native';
import { CarrierManager } from '../../../services/CarrierManager';

@Component({
    selector: 'app-addfriend',
    templateUrl: 'addfriend.page.html',
    styleUrls: ['addfriend.page.scss']
})
export class AddFriendPage {

    private items = [{'online':true, 'label':'label', 'uid':'uid'}, {'online':false, 'label':'label', 'uid':'uid'}];
    private scannedCode: string = "";
    private address: string = "";
    private friendRequest: string = "Hello";

    constructor(
            private route: ActivatedRoute,
            private platform: Platform,
            private native: Native,
            private carrierManager: CarrierManager) {
        this.route.queryParams.subscribe((data) => {
            this.address = data["address"];
        });
    }

    addFriend() {
        console.log("AddFriend:" + this.address);
        if (this.platform.is("desktop")) { //for test
            this.carrierManager.addFriend(this.address, "Hello",
                (data) => {
                    console.log("AddFriend success");
                    this.native.setRootRouter("/tabs");
                },
                null);
        }
        else {
            this.carrierManager.isValidAddress(this.address,
            (data) => {
                if (data) {
                    this.carrierManager.addFriend(this.address, this.friendRequest,
                        (data) => {
                            console.log("AddFriend success");
                            this.native.setRootRouter("/tabs");
                        },
                        (err) => {
                            console.log("AddFriend error: " + err);
                        });
                }
                else {
                    this.native.toast("address error!");
                }
            },
            null);
        }
    }

    scanCode() {
        this.native.go("/scan", null);
    }

}
