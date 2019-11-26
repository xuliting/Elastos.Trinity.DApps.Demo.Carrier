/*
 * Copyright (c) 2019 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Injectable } from '@angular/core';
import { Events, Platform } from '@ionic/angular';
import { Native } from './Native';


export class ChatMessage {
    messageId: string;
    userId: string;
    userAvatar: string;
    toUserId: string;
    time: number | string;
    message: string;
    status: string;
}

declare let carrierManager: CarrierPlugin.CarrierManager;
let carrierObj: CarrierPlugin.Carrier;

let eventObj = null;
let messageList: ChatMessage[] = [];

@Injectable()
export class CarrierService {

    private static opts = {
        udpEnabled: true,
        persistentLocation: ".data"
    };
    private static sIsReady = false;
    private myInterval: any; //for test
    // private carrierManager;

    private callbacks = {
        onConnection: this.connection_callback,
        onReady: this.ready_callback,
        onSelfInfoChanged: this.self_info_callback,
        onFriends: this.friends_list_callback,
        onFriendConnection: this.friend_connection_callback,
        onFriendInfoChanged: this.friend_info_callback,
        onFriendPresence: this.friend_presence_callback,
        onFriendRequest: this.friend_request_callback,
        onFriendAdded: this.friend_added_callback,
        onFriendRemoved: this.friend_removed_callback,
        onFriendMessage: this.message_callback,
        onFriendInviteRequest: this.invite_request_callback,
        onSessionRequest: this.session_request_callback,
    }

    constructor(public native: Native, public event: Events, public platform: Platform) {
        eventObj = event;
    }

    init() {
        if (this.platform.is("desktop")) {
            this.myInterval = setInterval(() => {
                this.ready_callback(null);
                clearInterval(this.myInterval);
            }, 2000);
        } else {
            this.createObject(this.CarrierCreateSuccess, null);
        }
    }

    isReady() {
        return CarrierService.sIsReady;
    }

    CarrierCreateSuccess(ret) {
        console.log("CarrierService CarrierCreateSuccess：", ret);
        carrierObj = ret;
        carrierObj.start(50, null, null);
    }

    // callback
    connection_callback(ret) {
        console.log("connection_callback");
        eventObj.publish('carrier:connectionchanged', ret, Date.now());
    }

    ready_callback(ret) {
        console.log("ready_callback");
        CarrierService.sIsReady = true;
        eventObj.publish('carrier:ready', ret, Date.now());
    }

    self_info_callback(ret) {
        console.log("self_info_callback");
        eventObj.publish('carrier:self_info', ret, Date.now());
    }

    friend_connection_callback(ret) {
        console.log("friend_connection_callback");
        eventObj.publish('carrier:friend_connection', ret, Date.now());
    }

    friend_info_callback(ret) {
        console.log("friend_info_callback");
        eventObj.publish('carrier:friend_info', ret, Date.now());
    }

    friends_list_callback(ret) {
        console.log("friends_list_callback");
        eventObj.publish('carrier:friends_list', ret, Date.now());
    }

    friend_presence_callback(ret) {
        console.log("friend_presence_callback");
        eventObj.publish('carrier:friend_presence', ret, Date.now());
    }

    friend_request_callback(ret) {
        console.log("friend_request_callback");
        eventObj.publish('carrier:friend_request', ret, Date.now());
    }

    friend_added_callback(ret) {
        console.log("friend_added_callback");
        eventObj.publish('carrier:friend_added', ret, Date.now());
    }

    friend_removed_callback(ret) {
        console.log("friend_removed_callback");
        eventObj.publish('carrier:friend_removed', ret, Date.now());
    }

    message_callback(ret) {
        console.log("message_callback");
        eventObj.publish('carrier:message', ret, Date.now());

        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: ret.from,
            userAvatar: './assets/images/avatar.png',
            toUserId: carrierObj.userId,
            time: Date.now(),
            message: ret.message,
            status: 'success'
        };
        messageList.push(newMsg);
    }

    invite_request_callback(ret) {
        console.log("invite_request_callback");
        eventObj.publish('carrier:invite_request', ret, Date.now());
    }

    session_request_callback(ret) {
        console.log("session_request_callback");
        eventObj.publish('carrier:session_request', ret, Date.now());
    }

    destroyCarrier() {
        console.log("destroyCarrier");
        if (carrierObj) {
            carrierObj.destroy();
            carrierObj = null;
        }
    }

    getMessageByUserId(userId) {
        return messageList.filter(x => (x.toUserId == userId) || (x.userId == userId));
    }

    getMsgIndexById(id: string) {
        return messageList.findIndex(e => e.messageId === id)
    }

    //------------------------------------------------------------

    createObject(success, error) {
        console.log("CarrierService createObject");
        // if CarrierService.opts is null, then use default config. (udpEnabled = true)
        carrierManager.createObject(
            this.callbacks, CarrierService.opts,
            (ret) => {success(ret);},
            (err) => {this.errorFun(err, error);});
    }

    isValidAddress(address, success, error) {
        carrierManager.isValidAddress(
            address,
            (ret) => {success(ret);},
            (err) => {this.errorFun(err, error);});
    }

    getUserId() {
        if (this.platform.is("desktop")) { //for test
            return "deafultUserId";
        }
        return carrierObj.userId;
    }

    getAddress(): string {
        if (this.platform.is("desktop")) { //for test
            return "EXfdeeeeeeeeeeeeeeeeeee";
        }
        return carrierObj.address;
    }

    getFriends(success, error) {
        carrierObj.getFriends(
            (ret) => {success(ret);},
            (err) => {this.errorFun(err, error);});
    }


    addFriend(address, hello, success, error) {
        if (this.platform.is("desktop")) { // for test
            success();
            this.myInterval = setInterval(() => {
                this.friend_added_callback(null);
                clearInterval(this.myInterval);
            }, 1000);
            return;
        }

        carrierObj.addFriend(
            address, hello,
            () => {success();},
            (err) => {this.errorFun(err, error);});
    }

    acceptFriend(userId, success, error) {
        carrierObj.acceptFriend(
            userId,
            () => {success();},
            (err) => {this.errorFun(err, error);});
    }

    removeFriend(userId, success, error) {
        if (this.platform.is("desktop")) { //for test
            return success("ok");
        }
        carrierObj.removeFriend(
            userId,
            () => {success();},
            (err) => {this.errorFun(err, error);});
    }

    sendMessage(chatMessage, success, error) {
        console.log("sendmessage: to:" + chatMessage.toUserId + " message:" + chatMessage.message);
        messageList.push(chatMessage);

        if (this.platform.is("desktop")) {//for test
            success();
            return;
        }

        let id = chatMessage.messageId;
        carrierObj.sendFriendMessage(
            chatMessage.toUserId, chatMessage.message,
            () => {
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    messageList[index].status = 'success';
                }
                success();},
            (err) => {this.errorFun(err, error);});
    }

    errorFun(err, errorFun = null) {
        this.native.info("errorFun:" + err);
        if (errorFun != null) {
            return errorFun(err);
        }
    }
}


