import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Native } from './Native';

declare let appManager: any;
let myService = null;

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
        myService = this;

        var me = this;
    }

    init() {
        if (this.platform.is("desktop")) return; //for test

        console.log("AppService init");
        appManager.setListener(this.onReceive);
        this.getLanguage();
    }

    print_err(err) {
        console.log("ElastosJS  Error: " + err);
    }

    getLanguage() {
        var me = this;
        appManager.getLocale(
            ret => {
                console.log(ret);
                me.setCurLang(ret.currentLang);
                me.setDefaultLang(ret.defaultLang);
                // me.setting.setSystemLang(ret.systemLang);
            },
            err => me.print_err(err)
        );
    }

    setDefaultLang(lang: string) {
        // ToDo
    }

    setCurLang(lang: string) {
        this.translate.use(lang);
        if (lang == 'en') {
            this.native.setMnemonicLang("english");
        } else if (lang == "zh") {
            this.native.setMnemonicLang("chinese");
        } else {
            this.native.setMnemonicLang("english");
        }
    }

    launcher() {
        appManager.launcher();
    }

    start(id: string) {
        appManager.start(id);
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
                        myService.setCurLang(params.code);
                        break;
                }
                break;
            default:
                break;
        }
    }
}
