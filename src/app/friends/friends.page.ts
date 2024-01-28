import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage extends AbstractBase implements OnInit {

  friendRequests: number = 0;
  sentRequests: number = 0;
  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
  }

  showSentRequests() {
    return this.navCtrl.navigateForward('start-tabs/friends/requests');
  }

  showFriendRequests() {
    return this.navCtrl.navigateForward('start-tabs/friends/sent');
  }

  showBlockedUser() {
    return this.navCtrl.navigateForward('start-tabs/friends/blocked');
  }
}
