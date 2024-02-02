import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {UserCollectionService} from "../../services/user/user-collection.service";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {IUser} from "../../interfaces/i-user";
import {CollectionService} from "../../services/collection.service";
import {NotificationService} from "../../_shared/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {ProfileHelper} from "../../_shared/helper/Profile";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  user: IUser;
  users: IUser[] = [];
  userId: string;
  type: string;
  lastDoc: any;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private userCollectionService: UserCollectionService,
              private localStorage: LocalStorageService, private notificationService: NotificationService,
              private translateService: TranslateService) {
    this.userId = this.route.snapshot.paramMap.get('userId');
   this.localStorage.getUser().then(user => {
     this.user = user;
     this.type = this.route.snapshot.queryParamMap.get('type');

     if (this.type === 'REQUESTS') {
       this.userCollectionService.getAll(20, null, [
         {key: 'id', opr: 'in', value: this.user._privateGalleryRequests}
       ], null, null, true, (snapshot) => {
         this.users = CollectionService.getSnapshotDataFromCollection(this.users, snapshot, null, {
           added: (doc) => {
             this.lastDoc = doc.docData;
           }
         });
       })
     } else if (this.type === 'RELEASES') {
       this.userCollectionService.getAll(20, null, [
         {key: 'id', opr: 'in', value: this.user._privateGalleryAccessUsers}
       ], null, null, true, (snapshot) => {
         this.users = CollectionService.getSnapshotDataFromCollection(this.users, snapshot, null, {
           added: (doc) => {
             this.lastDoc = doc.docData;
           }
         });
       })
     }
   });
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.pop();
  }

  accept(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.user._privateGalleryRequests = this.user._privateGalleryRequests.filter(userId => id !== userId);

    if (!this.user._privateGalleryAccessUsers) {
      this.user._privateGalleryAccessUsers = [];
    }
    this.user._privateGalleryAccessUsers.push(id);

    return this.userCollectionService.set(this.userId, this.user).then(async () => {
      const sentTo = await this.userCollectionService.get(id);
      const translations = await this.translateService.getTranslation((this.user._settings.currentLang || 'en')).toPromise();

      return this.notificationService.sendMessage(sentTo, {
        title: this.user.username + translations['HASACCEPTEDREQUEST'],
        body: translations['ACCESSTOPRIVATE'],
        badge: ProfileHelper.calculateBadge(sentTo).toString()
      }, 'privateGalleryAnswer', {
        userId: this.user.id,
        type: 'PRIVATEGALLERYANSWER'
      });
    })
  }

  takeBack(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.user._privateGalleryAccessUsers = this.user._privateGalleryAccessUsers.filter(userId => id !== userId);
    return this.userCollectionService.set(this.userId, this.user);
  }

  decline(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.user._privateGalleryRequests = this.user._privateGalleryRequests.filter(userId => id !== userId);
    return this.userCollectionService.set(this.userId, this.user);
  }
}
