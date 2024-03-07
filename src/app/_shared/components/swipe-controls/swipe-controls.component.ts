import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {SwipeControlsService} from "./swipe-controls.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {ILike} from "../../../interfaces/i-like";
import {ActionSheetController, NavController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-swipe-controls',
  templateUrl: './swipe-controls.component.html',
  styleUrls: ['./swipe-controls.component.scss'],
})
export class SwipeControlsComponent implements OnInit {

  @Input() user: IUser;
  me: IUser;
  likesData: ILike;
  isSending: boolean = false;

  constructor(private swipeControlsService: SwipeControlsService, protected localStorage: LocalStorageService,
              private actionSheetCtrl: ActionSheetController, private translateService: TranslateService,
              protected navCtrl: NavController) {

  }

  private registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.me = e.detail.user;
    })
  }

  ngOnInit() {
    this.registerEvents();

    this.localStorage.getUser().then((user) => {
      this.me = user;

      if (this.me) {
        this.swipeControlsService.likeListener(this.user.id, this.me.id, (snapshot) => {
          this.likesData = snapshot.data();
        });
      }
    });
  }

  toggleLike() {
    if (!this.likesData) {
      return this.swipeControlsService.sendLike({
        sentFrom: {
          id: this.me.id,
          username: this.me.username,
          profilePictures: this.me.profilePictures
        },
        createdAt: Date.now(),
        seen: false
      }, this.user);
    } else {
      return this.swipeControlsService.removeLike(this.me.id, this.user.id);
    }
  }

  async toggleFriendRequest(status: 'new' | 'requested' | 'got-request' | 'friends') {
    this.isSending = true;
    let sheet;

    switch (status) {
      case "new":
        return this.swipeControlsService.sendRequest(this.me, this.user).then(() => this.isSending = false);
      case "requested":
        return this.swipeControlsService.removeRequest(this.me, this.user).then(() => this.isSending = false);
      case "got-request":
        sheet = await this.actionSheetCtrl.create({
          buttons: [
            {
              text: this.translateService.instant('ACCEPT'),
              handler: () => {
                return this.swipeControlsService.acceptRequest(this.user, this.me).then(() => this.isSending = false);
              }
            },
            {
              text: this.translateService.instant('REFUSE'),
              role: "destructive",
              handler: () => {
                return this.swipeControlsService.removeRequest(this.user, this.me).then(() => this.isSending = false);
              }
            }
          ]
        });

        return sheet.present();
      case "friends":
        sheet = await this.actionSheetCtrl.create({
          buttons: [
            {
              text: this.translateService.instant('ENDFRIENDSHIP'),
              role: "destructive",
              handler: () => {
                return this.swipeControlsService.endFriendship(this.user, this.me).then(() => this.isSending = false);
              }
            }
          ]
        });

        return sheet.present();
      default:
        return false;
    }
  }

  openchat() {
    return this.swipeControlsService.openChat(this.user.id);
  }
}
