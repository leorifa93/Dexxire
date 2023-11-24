import {Component, OnInit, ViewChild} from '@angular/core';
import {IonTabs} from "@ionic/angular";

@Component({
  selector: 'app-start-tabs',
  templateUrl: './start-tabs.page.html',
  styleUrls: ['./start-tabs.page.scss'],
})
export class StartTabsPage implements OnInit {

  @ViewChild('startTabs') tabRef: IonTabs
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.tabRef.select('home');
  }
}
