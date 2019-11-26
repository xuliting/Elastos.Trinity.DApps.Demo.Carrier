import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Native } from '../../services/Native';
import { PopupProvider } from '../../services/popup';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.page.html',
    styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
    light: boolean;
    frontCamera: boolean;
    isShow = false;
    pageType: string;

    constructor(
            private route: ActivatedRoute,
            private qrScanner: QRScanner,
            private popupProvider: PopupProvider,
            private native: Native) {
        this.light = false;
        this.frontCamera = false;
        this.route.queryParams.subscribe((data) => {
            this.pageType = data["pageType"];
        });
        (window.document.querySelector('ion-content') as HTMLElement).classList.add('cameraView');
    }

    ngOnInit() {
        this.qrScanner.prepare().then((status: QRScannerStatus) => {
            if (status.authorized) {
                // camera permission was granted
                // start scanning
                // let scanSub =
                this.qrScanner.scan().subscribe((text: string) => {
                    this.hideCamera();
                    this.native.go("/addfriend", {"address":text});
                });
                // show camera preview
                this.qrScanner.show();
                // wait for user to scan something,then the observable callback will be called
            } else if (status.denied) {
                this.popupProvider.ionicAlert("error",
                        "permission was permanently denied, check authorized plugin!");
                // camera permission was permanently denied
                // you must use QRScanner.openSettings() method to guide the user to the settings page
                // then they can grant the permission from there
            } else {
                this.popupProvider.ionicAlert("erro",
                        "permission was denied, but not permanently. You can ask for permission again at a later time!");
            }
        }).catch((e: any) => {
            console.log('Error is', e);
            this.popupProvider.ionicAlert("error", e._message);
        });
    }

    ionViewDidEnter() {
        this.showCamera();
        this.isShow = true;
    }

    ionViewDidLeave() {
        this.hideCamera();
        this.isShow = false;
    }

    toggleLight() {
        if (this.light) {
            this.qrScanner.disableLight();
        } else {
            this.qrScanner.enableLight();
        }
        this.light = !this.light;
    }

    toggleCamera() {
        if (this.frontCamera) {
            this.qrScanner.useBackCamera();
        } else {
            this.qrScanner.useFrontCamera();
        }
        this.frontCamera = !this.frontCamera;
    }

    showCamera() {
        // (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }

    hideCamera() {
        // (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
        this.qrScanner.hide();
        this.qrScanner.destroy();
    }
}
