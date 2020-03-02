import { Component, NgZone } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { Native } from '../../services/Native';
import { CarrierService } from '../../services/CarrierService';
import { PopupProvider } from '../../services/popup';
import { AppService } from 'src/app/services/AppService';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.page.html',
    styleUrls: ['friends.page.scss']
})
export class FriendsPage {

    public friends = [{'status':1, 'name':'', 'userId':'1000'}, {'status':0, 'name':'Tom', 'userId':'1001'}];
    public friendList = [];
    status = 0;

    constructor(
            private event: Events,
            private platform: Platform,
            private zone: NgZone,
            private popupProvider: PopupProvider,
            private native: Native,
            private appService: AppService,
            private carrierService: CarrierService) {
    }

    ngOnInit() {
        // TODO: in ios, ionViewDidEnter will execute before carrier:ready ?
        this.event.subscribe('carrier:ready', msg => {
            console.log("carrier:ready");
            this.init();
        });

        this.event.subscribe('carrier:connectionchanged', msg => {
            console.log("carrier:connectionchanged");
            this.zone.run(() => {
                this.status = msg.status;
            });
        });

        this.event.subscribe('carrier:friend_connection', msg => {
            console.log("carrier:friend_connection friendId:" + msg.friendId + "  status:" + msg.status);
            const index = this.getFriendIndexById(msg.friendId);
            if (index !== -1) {
                this.zone.run(() => {
                    this.friendList[index].status = msg.status;
                });
            }
        });

        this.event.subscribe('carrier:friend_added', msg => {
            let friend: any;
            if (this.platform.is("desktop")) { //for test
                friend = {
                    userId: "100",
                    name: "New Contact",
                    status: 1
                };
            } else {
                friend = {
                    userId: msg.friendInfo.userInfo.userId,
                    name: msg.friendInfo.userInfo.name,
                    status: msg.friendInfo.status
                };
            }
            console.log("carrier:friend_added: " + friend.userId + " status:" + msg.friendInfo.status);
            this.zone.run(() => {
                this.friendList.push(friend);
            });
        });

        this.event.subscribe('carrier:friend_removed', msg => {
            console.log("friend_removed:" + msg.friendId);
            this.deleteFriend(msg.friendId);
        });

        this.event.subscribe('carrier:friend_request', msg => {
            console.log("friend_request :" + msg.userId + " with:" + msg.hello);
            const message = "From: " + msg.userId + "\r\n with:" + msg.hello;
            this.popupProvider.ionicConfirm("Friend Request", message, "Yes", "NO").then((data) => {
                if (data) {
                    this.carrierService.acceptFriend(msg.userId,
                        () => {
                            console.log("AddFriend success");
                            this.native.setRootRouter("/tabs");
                        },
                        null);
                }
            });
        });
    }

    ngOnDestroy() {
        this.carrierService.destroyCarrier();
    }

    ionViewDidEnter() {
        this.init();
    }

    init() {
        this.friendList = [];

        if (this.platform.is("desktop")) { //for test
            for (var id in this.friends) {
                let friend = {
                    userId: this.friends[id].userId,
                    name: this.friends[id].name,
                    status: this.friends[id].status
                }

                this.friendList.push(friend);
            }
            return;
        }

        this.carrierService.getFriends((data) => {
            console.log("friends.getFriends:" + data);
            let friends = data.friends;
            if (typeof friends == "string") {
                friends = JSON.parse(friends);
            }

            this.zone.run(() => {
                for (var id in friends) {
                    let friend = {
                        userId: friends[id].userInfo.userId,
                        name: friends[id].userInfo.name,
                        status: friends[id].status
                    }

                    this.friendList.push(friend);
                }
            });
        },
        null);
    }

    addFriend() {
        this.native.go("/addfriend", {"address" : ""});
    }

    scanCode() {
        this.appService.scanAddress();
    }

    itemSelected(item) {
        console.log("item:" + item);
        this.native.go("/chat", {userId: item.userId, status: item.status});
    }

    presentSetNickname(item) {

    }

    deleteFriend(userId) {
        console.log("friends.page deleteFriend");
        this.carrierService.removeFriend(userId, (data) => {
            console.log("removeFriend success:" + userId);
        },
        null);

        for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].userId === userId) {
                this.zone.run(() => {
                    this.friendList.splice(i, 1);
                });
                break;
           }
        }
    }

    getFriendIndexById(id: string) {
        return this.friendList.findIndex(e => e.userId === id);
    }
}
