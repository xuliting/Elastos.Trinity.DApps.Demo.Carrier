import { Component, NgZone } from '@angular/core';
import { AlertController, Events, Platform } from '@ionic/angular';
import { Native } from '../../services/Native';
import { CarrierManager } from '../../services/CarrierManager';
import { PopupProvider } from '../../services/popup';

@Component({
    selector: 'app-friends',
    templateUrl: 'friends.page.html',
    styleUrls: ['friends.page.scss']
})
export class FriendsPage {

    public friends = [{'status':1, 'name':'', 'userId':'1000'}, {'status':2, 'name':'Tom', 'userId':'1001'}];
    private scannedCode: string = "";
    public friendList = [];

    constructor(
            private alertCtrl: AlertController,
            private event: Events,
            private platform: Platform, private zone: NgZone,
            private popupProvider: PopupProvider,
            private native: Native,
            private carrierManager: CarrierManager) {
    }

    ngOnInit() {
        this.event.subscribe('carrier:connectionchanged', msg => {
            console.log("carrier:connectionchanged");
        });

        this.event.subscribe('carrier:friend_connection', msg => {
            console.log("carrier:friend_connection friendId:" + msg.friendId + "  status:" + msg.status);
            let index = this.getFriendIndexById(msg.friendId);
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
                }
            }
            else {
                friend = {
                    userId: msg.friendInfo.userInfo.userId,
                    name: msg.friendInfo.userInfo.name,
                    status: msg.friendInfo.status
                }
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
            let message = "From: " + msg.userId + "\r\n with:" + msg.hello;
            this.popupProvider.ionicConfirm("Friend Request", message, "Yes", "NO").then((data) => {
                if (data) {
                    this.carrierManager.acceptFriend(msg.userId,
                        (data) => {
                            console.log("AddFriend success");
                            this.native.setRootRouter("/tabs");
                        },
                        null);
                }
            });
        });
    }

    ngOnDestroy() {
        this.carrierManager.destroyCarrier();
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

        this.carrierManager.getFriends((data) => {
            console.log("friends.getFriends:" + data);
            var friends = data.friends;
            if (typeof friends == "string") {
                friends = JSON.parse(friends);
            }

            for (var id in friends) {
                let friend = {
                    userId: friends[id].userInfo.userId,
                    name: friends[id].userInfo.name,
                    status: friends[id].status
                }

                this.friendList.push(friend);
            }
        },
        null);
    }

    addFriend() {
        this.native.go("/addfriend", {"address" : ""});
    }

    scanCode() {
        this.native.go("/scan", null);
    }

    itemSelected(item) {
        this.native.go("/chat", {"userId": item.userId});
    }

    presentSetNickname(item) {

    }

    deleteFriend(userId) {
        console.log("friends.page deleteFriend");
        this.carrierManager.removeFriend(userId, (data) => {
            console.log("removeFriend success:" + userId);
        },
        null);

        for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].userId == userId) {
                this.friendList.splice(i, 1);
                break;
           }
        }
    }

    getFriendIndexById(id: string) {
        return this.friendList.findIndex(e => e.userId === id)
    }

}
