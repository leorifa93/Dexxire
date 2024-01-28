import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";
import {LikeCollectionService} from "../_shared/components/swipe-controls/services/like-collection.service";
import {ILike} from "../interfaces/i-like";
import {UserService} from "../services/user/user.service";
import {IUser} from "../interfaces/i-user";
import {Capacitor} from "@capacitor/core";
import {Badge} from "@robingenz/capacitor-badge";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage extends AbstractBase implements OnInit {

  me: IUser;
  likes: ILike[] = [];

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              private likesCollectionService: LikeCollectionService, private userService: UserService,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
    this.getLikes();
  }

  getLikes() {
    this.localStorage.getUser().then((user) => {
      this.me = user;

      this.likesCollectionService.getAll(10, null, null, 'createdAt', null, false,
        null, [user.id, 'Users'])
        .then((likes) => {
          this.likes = this.likes.concat(likes);
        })
    });
  }

  showProfile(like: ILike) {
    if (!like.seen && Capacitor.isNativePlatform()) {
      Badge.decrease();
    }
    like.seen = true;

    this.likesCollectionService.set(this.me.id, like, null, ['Users', like.sentFrom.id]);
    this.userService.showProfile(like.sentFrom, this.me);
  }
}
