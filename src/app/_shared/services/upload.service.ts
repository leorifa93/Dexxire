import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL, listAll } from "firebase/storage";
import {ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private toastCtrl: ToastController, private translateService: TranslateService) { }

  async uploadFile(base64: string, name: string) {
    const toast = await this.toastCtrl.create({message: this.translateService.instant('UPLOADING') + '...'});
    const storageRef = ref(getStorage(), 'Dexxire/' + name);

    toast.present();

    return new Promise((resolve) => {
      uploadString(storageRef, base64, 'data_url').then(async () => {
        let thumbnailsPath: any = 'Dexxire/' + name;
        thumbnailsPath = thumbnailsPath.split("/");
        thumbnailsPath.pop();
        thumbnailsPath = thumbnailsPath.join("/");

        const listRef = ref(getStorage(), thumbnailsPath + '/thumbnails');
        const pictures: any = {thumbnails: {}};
        pictures.original = await getDownloadURL(storageRef);

        const interval = setInterval(() => {
          listAll(listRef).then(async (res) => {
            if (res.items.length > 0) {
              clearInterval(interval);
            }

            pictures.thumbnails.small = await getDownloadURL(res.items[0]);
            pictures.thumbnails.medium = await getDownloadURL(res.items[1]);
            pictures.thumbnails.big = await getDownloadURL(res.items[2]);

            toast.dismiss().then(() => resolve(pictures));
          })
        }, 500);
      })
    })
  }


}
