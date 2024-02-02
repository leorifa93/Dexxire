import { Injectable } from '@angular/core';
import {LikeCollectionService} from "./services/like-collection.service";
import {ILike} from "../../../interfaces/i-like";
import {ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {FriendsCollectionService} from "./services/friends-collection.service";
import {IUser} from "../../../interfaces/i-user";
import {NotificationService} from "../../services/notification.service";
import {ProfileHelper} from "../../helper/Profile";
import {DataType} from "../../../constants/Notifications";
import {ChatsCollectionService} from "../../../chats/services/chats-collection.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SwipeControlsService {
  constructor(private likeCollectionService: LikeCollectionService,  private toastCtrl: ToastController,
              private translateService: TranslateService, private friendsCollectionService: FriendsCollectionService,
              private notificationService: NotificationService, private chatsCollectionService: ChatsCollectionService,
              private router: Router) { }

  sendLike(like: ILike, sentTo: IUser) {
    return this.likeCollectionService.set(sentTo.id, like, null, ['Users', like.sentFrom.id])
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: this.translateService.instant('SENTLIKE'),
          duration: 2000
        });

        return toast.present();
      });
  }

  removeLike(sentFrom: string, sentTo: string) {
    return this.likeCollectionService.remove(sentTo, null, ['Users', sentFrom]);
  }

  likeListener(sentTo: string, sentFrom: string, callback: (snapshot) => void) {
    this.likeCollectionService.observer(sentTo, callback, ['Users', sentFrom]);
  }

  async sendRequest(sentFrom: IUser, sentTo: IUser) {
    if (!sentFrom._sentFriendRequests) {
      sentFrom._sentFriendRequests = [];
    }

    if (!sentFrom._sentFriendRequests.includes(sentTo.id)) {
      sentFrom._sentFriendRequests.push(sentTo.id);
    }

    if (!sentTo._friendRequests) {
      sentTo._friendRequests = [];
    }

    if (!sentTo._friendRequests.includes(sentFrom.id)) {
      sentTo._friendRequests.push(sentFrom.id);
    }

    const promises = [
      this.friendsCollectionService.set(sentFrom.id, sentFrom, 'Users'),
      this.friendsCollectionService.set(sentTo.id, sentTo, 'Users')
    ]

    return Promise.all(promises).then(async () => {
      const translations = await this.translateService.getTranslation((sentTo._settings.currentLang || 'en')).toPromise();

      this.notificationService.sendMessage(sentTo, {
        title: translations['NEWFRIENDREQUEST'],
        body: sentFrom.username + translations['HASSENTFRIENDREQUEST'],
        badge: ProfileHelper.calculateBadge(sentTo).toString()
      }, 'friend', {
        type: DataType.FriendRequest
      });
    })
  }

  async removeRequest(sentFrom: IUser, sentTo: IUser) {
    sentFrom._sentFriendRequests = sentFrom._sentFriendRequests.filter((id) => id !== sentTo.id);
    sentTo._friendRequests = sentTo._friendRequests.filter(id => id !== sentFrom.id);

    await this.friendsCollectionService.set(sentFrom.id, sentFrom, 'Users');
    await this.friendsCollectionService.set(sentTo.id, sentTo, 'Users');
  }

  async acceptRequest(sentFrom: IUser, sentTo: IUser) {
    sentFrom._sentFriendRequests = sentFrom._sentFriendRequests.filter((id) => id !== sentTo.id);
    sentTo._friendRequests = sentTo._friendRequests.filter(id => id !== sentFrom.id);

    if (!sentFrom._friendsList) {
      sentFrom._friendsList = [];
    }
    sentFrom._friendsList.push(sentTo.id);

    if (!sentTo._friendsList) {
      sentTo._friendsList = [];
    }
    sentTo._friendsList.push(sentFrom.id);

    let now = Date.now();

    this.friendsCollectionService.set(sentFrom.id, {
      friendId: sentTo.id,
      username: sentTo.username,
      profilePictures: sentTo.profilePictures,
      since: now
    }, null, ['Users', sentTo.id]);

    this.friendsCollectionService.set(sentTo.id, {
      friendId: sentFrom.id,
      username: sentFrom.username,
      profilePictures: sentFrom.profilePictures,
      since: now
    }, null, ['Users', sentFrom.id])

    const promises = [
      this.friendsCollectionService.set(sentFrom.id, sentFrom, 'Users'),
      this.friendsCollectionService.set(sentTo.id, sentTo, 'Users')
    ]

    return Promise.all(promises).then(async () => {
      const translations = await this.translateService.getTranslation((sentTo._settings.currentLang || 'en')).toPromise();

      return this.notificationService.sendMessage(sentFrom, {
        title: translations['YOUAREFRIENDS'],
        body: sentTo.username + translations['HASACCEPTFRIENDREQUEST'],
        badge: ProfileHelper.calculateBadge(sentFrom).toString()
      }, 'friend', {});
    })
  }

  async endFriendship(sentFrom: IUser, sentTo: IUser) {
    sentFrom._friendsList = sentFrom._friendsList.filter((id) => id !== sentTo.id);
    sentTo._friendsList = sentTo._friendsList.filter(id => id !== sentFrom.id);

    await this.friendsCollectionService.set(sentFrom.id, sentFrom, 'Users');
    await this.friendsCollectionService.set(sentTo.id, sentTo, 'Users');
  }

  openChat(userId: string) {
    return this.router.navigate(['/chat/' + userId]);
  }
}
