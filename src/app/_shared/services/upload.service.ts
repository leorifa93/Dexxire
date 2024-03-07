import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import {ToastController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private toastCtrl: ToastController, private translateService: TranslateService) { }

  async uploadFile(base64: string, name: string): Promise<{ uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string }, approved?: boolean }> {
    const toast = await this.toastCtrl.create({message: this.translateService.instant('UPLOADING') + '...'});
    const storageRef = ref(getStorage(), 'Dexxire/' + name);

    toast.present();

    return new Promise<{ uploadAt: number, original: string, thumbnails?: { small: string, medium: string, big: string }, approved?: boolean }>((resolve) => {
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
              pictures.thumbnails.small = await getDownloadURL(res.items[0]);
              pictures.thumbnails.medium = await getDownloadURL(res.items[1]);
              pictures.thumbnails.big = await getDownloadURL(res.items[2]);

              clearInterval(interval);
              toast.dismiss().then(() => resolve(pictures));
            }
          })
        }, 500);
      })
    })
  }


  listFolder(refPath: string) {
    const listRef = ref(getStorage(), refPath);
    const subscriber = new BehaviorSubject<string>(null);

    listAll(listRef).then(async (res) => {
      for (let item of res.items) {
        subscriber.next(await getDownloadURL(item))
      }
    });

    return subscriber;
  }

  deleteAll(refPath: string) {
    refPath = 'Dexxire/' + refPath;
    const listRef = ref(getStorage(), refPath);
    const thumbnailsRef = ref(getStorage(), refPath + '/thumbnails');

    listAll(listRef).then((listResults) => {
      for (let item of listResults.items) {
        deleteObject(ref(getStorage(), item.fullPath));
      }
    })

    listAll(thumbnailsRef).then((listResults) => {
      for (let item of listResults.items) {
        deleteObject(ref(getStorage(), item.fullPath));
      }
    })
  }
}
