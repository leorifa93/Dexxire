import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IUser} from "../../interfaces/i-user";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  sendMessage(sentTo: IUser, payload: {
    title?: string,
    body: string,
    badge?: string
  }, type: 'friend' | 'messages' | 'likes' | 'privateGallery' | 'privateGalleryRequest' | 'privateGalleryAnswer', data?: any) {
    if (!sentTo._deviceIds || sentTo._deviceIds.length === 0
      || (type === 'friend' && !sentTo._settings.notifications.friendRequests)
      || (type === 'messages' && !sentTo._settings.notifications.messages)
      || (type === 'likes' && !sentTo._settings.notifications.likes)) {
        return false;
    }

    let notification = Object.assign({
      click_action: "FCM_PLUGIN_ACTIVITY"
    }, payload);

    if (!payload.title) {
      payload.title = 'Dexxire';
    }

    let body: any = {
      registration_ids: sentTo._deviceIds,
      notification: notification
    };

    if (data) {
      body.data = data;
    }

    const subscribe = this.http.post(environment.sendNotificationUrl, body, {
      headers: {
        'Authorization': environment.notificationServerKey,
        'Content-Type': 'application/json'
      }
    }).subscribe(() => subscribe.unsubscribe());

    return true;
  }
}
