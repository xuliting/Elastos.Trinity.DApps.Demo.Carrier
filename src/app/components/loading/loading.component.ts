import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
    public message = '';

    constructor(public modalCtrl: ModalController, private navParams: NavParams) {
        this.message = navParams.get('message');
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        appManager.setVisible("show", () => {}, (err) => {});
    }

    hideModal() {
        this.modalCtrl.dismiss(null);
    }
}
