import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Native } from './Native';

declare let appManager: AppManagerPlugin.AppManager;
let appManagerObj = null;

enum MessageType {
    INTERNAL = 1,
    IN_RETURN = 2,
    IN_REFRESH = 3,

    EXTERNAL = 11,
    EX_LAUNCHER = 12,
    EX_INSTALL = 13,
    EX_RETURN = 14,
};

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public appInfos: any = {};
    public appList: any = [];
    public runningList: any = [];
    public lastList: any = [];
    public rows: any = [];
    private currentLang: string = null;

    constructor(
            private translate: TranslateService,
            private platform: Platform,
            private native: Native) {
        appManagerObj = this;

        var me = this;
    }

    init() {
        if (this.platform.is("desktop")) return; //for test

        console.log("AppService init");
        appManager.setListener(this.onReceive);
        this.getLanguage();
    }

    getLanguage() {
        var me = this;
        appManager.getLocale(
            (defaultLang, currentLang, systemLang) => {
                console.log('defaultLang', defaultLang, ' currentLang:', currentLang, ' systemLang:', systemLang);
                me.setCurLang(currentLang);
                me.setDefaultLang(defaultLang);
            }
        );
    }

    setDefaultLang(lang: string) {
        // TODO
    }

    setCurLang(lang: string) {
        //TODO
    }

    launcher() {
        appManager.launcher();
    }

    start(id: string) {
        appManager.start(id, ()=>{});
    }

    close() {
        appManager.close();
    }

    onReceive(ret) {
        console.log("ElastosJS  HomePage receive message:" + ret.message + ". type: " + ret.type + ". from: " + ret.from);
        var params: any = ret.message;
        if (typeof (params) == "string") {
            params = JSON.parse(params);
        }
        console.log(params);
        switch (ret.type) {
            case MessageType.IN_REFRESH:
                switch (params.action) {
                    case "currentLocaleChanged":
                        appManagerObj.setCurLang(params.code);
                        break;
                }
                break;
            default:
                break;
        }
    }
}
