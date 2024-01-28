import { Injectable } from '@angular/core';
import {LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";
import {ActionPerformed, PushNotifications, PushNotificationSchema} from "@capacitor/push-notifications";
import {Router} from "@angular/router";
import {DataType} from "../../constants/Notifications";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private router: Router) { }

  addListeners() {
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      return this.navigate(notification, true);
    })

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        LocalNotifications.schedule({
          notifications: [{
            id: 1,
            title: notification.title,
            body: notification.body,
            extra: notification.data
          }]
        })
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        return this.navigate(notification);
      }
    );
  }

  async removeListeners() {
    await PushNotifications.removeAllListeners();
  }

  private navigate(notification: any, isLocal: boolean = false) {
    const data = notification.notification[isLocal ? 'extra' : 'data'];

    if (data) {
      if (data.type === DataType.FriendRequest) {
        return this.router.navigate(['start-tabs/friends/requests']);
      } else if (data.type === DataType.Like) {
        return this.router.navigate(['/notifications']);
      } else if (data.type === DataType.Chat) {
        return this.router.navigate(['/chat/' + data.userId]);
      } else if (data.type === DataType.PrivateGallery) {
        return this.router.navigate(['/profile/' + data.userId])
      }
    }

    return false;
  }
}
