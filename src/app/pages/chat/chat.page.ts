import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events, Platform } from '@ionic/angular';
import { AppService } from '../../services/AppService';
import { CarrierService, ChatMessage } from '../../services/CarrierService';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-chat',
    templateUrl: 'chat.page.html',
    styleUrls: ['chat.page.scss']
})
export class ChatPage {
    msgList: ChatMessage[] = [];
    myId = '';
    friendId = '';
    editorMsg = '';
    status = 1;

    constructor(
            private route: ActivatedRoute,
            private event: Events,
            private zone: NgZone,
            private platform: Platform,
            private appService: AppService,
            private carrierService: CarrierService) {
        this.route.queryParams.subscribe((data) => {
            this.friendId = data.userId;
            this.status = data.status;
            this.myId = this.carrierService.getUserId();
            console.log("friendId:" + this.friendId);
        });
    }

    ngOnInit() {
        this.event.subscribe('carrier:friend_connection', msg => {
            console.log("carrier:friend_connection friendId:" + msg.friendId + "  status:" + msg.status);
            if (msg.friendId == this.friendId) {
                this.zone.run(() => {
                    this.status = msg.status;
                });
            }
        });

        this.event.subscribe('carrier:message', msg => {
            console.log("carrier:message friendId:" + msg.from + "  message:" + msg.message);

            if (msg.from == this.friendId) {
                let newMsg: ChatMessage = {
                    messageId: Date.now().toString(),
                    userId: msg.from,
                    userAvatar: './assets/images/avatar.png',
                    toUserId: this.myId,
                    time: msg.time,
                    message: msg.message,
                    status: 'success'
                };

                this.zone.run(() => {
                    this.msgList.push(newMsg);
                    this.scrollToBottom();
                });
            }
        });
    }

    ionViewWillEnter() {
        this.init();
        titleBarManager.setTitle("Chat");
        this.appService.setTitleBarBackKeyShown(true);
    }

    ionViewWillLeave() {
        this.appService.setTitleBarBackKeyShown(false);
    }

    init() {
        this.msgList = this.carrierService.getMessageByUserId(this.friendId);

        if (this.platform.is("desktop")) { //for test
            let newMsg: ChatMessage = {
                messageId: Date.now().toString(),
                userId: this.friendId,
                userAvatar: './assets/images/avatar.png',
                toUserId: this.myId,
                time: Date.now(),
                message: "test message",
                status: 'success'
            };

            this.pushMessage(newMsg);
        }
    }

    sendMessage() {
        if (!this.editorMsg.trim()) return;

        console.log("sendMessage: to:" + this.friendId + " msg:" + this.editorMsg)

        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.myId,
            userAvatar: './assets/images/avatar.png',
            toUserId: this.friendId,
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending'
        };

        this.pushMessage(newMsg);

        this.carrierService.sendMessageWithReceipt(newMsg,
            (data) => {
                console.log("sendFriendMessage success");
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    this.msgList[index].status = 'success';
                }
            },
            null);

        this.editorMsg = "";
    }

    pushMessage(msg: ChatMessage) {
        const userId = this.myId,
        toUserId = this.friendId;
        // Verify user relationships
        if (msg.userId === userId && msg.toUserId === toUserId) {
          this.msgList.push(msg);
        } else if (msg.toUserId === userId && msg.userId === toUserId) {
          this.msgList.push(msg);
        }
        this.scrollToBottom();
    }

    getContent() {
        return document.querySelector('ion-content');
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.getContent().scrollToBottom) {
                this.getContent().scrollToBottom();
            }
        }, 400);
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    getTime(time): string {
        const date = new Date();
        date.setTime(time);
        return date.toLocaleTimeString();
    }
}
