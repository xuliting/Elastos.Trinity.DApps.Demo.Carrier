import { Component, OnInit, Input } from '@angular/core';
import { Native } from '../../services/Native';

@Component({
    selector: 'my-qrcode',
    templateUrl: './my-qrcode.component.html',
    styleUrls: ['./my-qrcode.component.scss'],
})
export class MyQrcodeComponent implements OnInit {
    public size: number = 0;
    @Input() address: string = "document.documentElement.clientWidthdocumentElement";
    @Input() title: string = "";

    constructor(public native:Native) {
        this.size = (540 * document.documentElement.clientWidth) / 750;
        console.log("size:" + this.size);
    }

    ngOnInit() {}

    copy() {
        this.native.copyClipboard(this.address);
        this.native.toast_trans('copy-ok');
    }

}
