import { Component } from '@angular/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  ionViewWillEnter() {
    titleBarManager.setTitle("Carrier Demo");
  }
}
