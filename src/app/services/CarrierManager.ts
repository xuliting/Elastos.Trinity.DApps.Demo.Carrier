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
import { Native } from "./Native";


export class ChatMessage {
    messageId: string;
    userId: string;
    userAvatar: string;
    toUserId: string;
    time: number | string;
    message: string;
    status: string;
}

declare let carrierPlugin: any;
let myCarrier = null;
let myEvent = null;
let messageList: ChatMessage[] = [];

@Injectable()
export class CarrierManager {

    private static s_isReady = false;
    private myInterval: any; //for test
    private carrierPlugin;

    private static bootstrapArg = [
        { ipv4: "13.58.208.50", port: "33445", publicKey: "89vny8MrKdDKs7Uta9RdVmspPjnRMdwMmaiEW27pZ7gh" },
        { ipv4: "18.216.102.47", port: "33445", publicKey: "G5z8MqiNDFTadFUPfMdYsYtkUDbX5mNCMVHMZtsCnFeb" },
        { ipv4: "18.216.6.197", port: "33445", publicKey: "H8sqhRrQuJZ6iLtP2wanxt4LzdNrN2NNFnpPdq1uJ9n2" },
        { ipv4: "52.83.171.135", port: "33445", publicKey: "5tuHgK1Q4CYf4K5PutsEPK5E3Z7cbtEBdx7LwmdzqXHL" },
        { ipv4: "52.83.191.228", port: "33445", publicKey: "3khtxZo89SBScAMaHhTvD68pPHiKxgZT6hTCSZZVgNEm" }
    ];

    private static opts = {
        udpEnabled: true,
        persistentLocation: ".data",
        bootstraps: CarrierManager.bootstrapArg
    };

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
        myEvent = event;
    }

    init() {
        if (this.platform.is("desktop")) {
            this.myInterval = setInterval(() => {
                this.ready_callback(null);
                clearInterval(this.myInterval);
            }, 2000);
        }
        else {
            this.carrierPlugin = carrierPlugin;
            this.createObject(this.CarrierCreateSuccess, null);
        }
    }

    isReady() {
        return CarrierManager.s_isReady;
    }

    CarrierCreateSuccess(ret) {
        myCarrier = ret;
        myCarrier.start(null, null, 50);
    }

    // callback
    connection_callback(ret) {
        console.log("connection_callback");
        myEvent.publish('carrier:connectionchanged', ret, Date.now());
    }

    ready_callback(ret) {
        console.log("ready_callback");
        CarrierManager.s_isReady = true;
        myEvent.publish('carrier:ready', ret, Date.now());
    }

    self_info_callback(ret) {
        console.log("self_info_callback");
        myEvent.publish('carrier:self_info', ret, Date.now());
    }

    friend_connection_callback(ret) {
        console.log("friend_connection_callback");
        myEvent.publish('carrier:friend_connection', ret, Date.now());
    }

    friend_info_callback(ret) {
        console.log("friend_info_callback");
        myEvent.publish('carrier:friend_info', ret, Date.now());
    }

    friends_list_callback(ret) {
        console.log("friends_list_callback");
        myEvent.publish('carrier:friends_list', ret, Date.now());
    }

    friend_presence_callback(ret) {
        console.log("friend_presence_callback");
        myEvent.publish('carrier:friend_presence', ret, Date.now());
    }

    friend_request_callback(ret) {
        console.log("friend_request_callback");
        myEvent.publish('carrier:friend_request', ret, Date.now());
    }

    friend_added_callback(ret) {
        console.log("friend_added_callback");
        myEvent.publish('carrier:friend_added', ret, Date.now());
    }

    friend_removed_callback(ret) {
        console.log("friend_removed_callback");
        myEvent.publish('carrier:friend_removed', ret, Date.now());
    }

    message_callback(ret) {
        console.log("message_callback");
        myEvent.publish('carrier:message', ret, Date.now());

        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: ret.from,
            userAvatar: './assets/images/avatar.png',
            toUserId: myCarrier.userId,
            time: Date.now(),
            message: ret.message,
            status: 'success'
        };
        messageList.push(newMsg);
    }

    invite_request_callback(ret) {
        console.log("invite_request_callback");
        myEvent.publish('carrier:invite_request', ret, Date.now());
    }

    session_request_callback(ret) {
        console.log("session_request_callback");
        myEvent.publish('carrier:session_request', ret, Date.now());
    }

    createCarrier() {
        this.createObject(this.CarrierCreateSuccess, null);
    }

    destroyCarrier() {
        console.log("destroyCarrier");
        if (myCarrier) {
            myCarrier.destroy();
            myCarrier = null;
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
        this.carrierPlugin.createObject(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            CarrierManager.opts, this.callbacks);
    }

    isValidAddress(address, success, error) {
        this.carrierPlugin.isValidAddress(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            address);
    }

    getUserId() {
        if (this.platform.is("desktop")) { //for test
            return "deafultUserId";
        }
        return myCarrier.userId;
    }

    getAddress(): string {
        if (this.platform.is("desktop")) { //for test
            return "EXfdeeeeeeeeeeeeeeeeeee";
        }
        return myCarrier.address;
    }

    getFriends(success, error) {
        myCarrier.getFriends(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);});
    }


    addFriend(address, hello, success, error) {
        if (this.platform.is("desktop")) { // for test
            this.successFun("", success);
            this.myInterval = setInterval(() => {
                this.friend_added_callback(null);
                clearInterval(this.myInterval);
            }, 1000);
            return;
        }

        myCarrier.addFriend(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            address, hello);
    }

    acceptFriend(userId, success, error) {
        myCarrier.acceptFriend(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            userId);
    }

    removeFriend(userId, success, error) {
        if (this.platform.is("desktop")) { //for test
            return success("ok");
        }
        myCarrier.removeFriend(
            (ret) => {this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            userId);
    }

    sendMessage(chatMessage, success, error) {
        console.log("sendmessage: to:" + chatMessage.toUserId + " message:" + chatMessage.message);
        messageList.push(chatMessage);

        if (this.platform.is("desktop")) {//for test
            this.successFun("", success);
            return;
        }

        let id = chatMessage.messageId;
        myCarrier.sendFriendMessage(
            (ret) => {
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    messageList[index].status = 'success';
                }
                this.successFun(ret, success);},
            (err) => {this.errorFun(err, error);},
            chatMessage.toUserId, chatMessage.message);
    }

    successFun(ret, okFun = null) {
        if (okFun != null) {
            return okFun(ret);
        }
    }

    errorFun(err, errorFun = null) {
        this.native.info("errorFun:" + err);
        if (errorFun != null) {
            return errorFun(err);
        }
    }
}


