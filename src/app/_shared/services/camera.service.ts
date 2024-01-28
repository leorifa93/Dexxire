import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, GalleryPhotos} from '@capacitor/camera';
import {Image, PhotoViewer} from "@capacitor-community/photoviewer";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {
  }

  async getPicture(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    return new Promise<string>((resolve) => {
      resolve('data:image/jpg;base64,' + image.base64String);
    });
  }

  getPictures(limit: number = 8): BehaviorSubject<string> {
    const subscriber: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    Camera.pickImages({
      limit: limit,
      quality: 100,
    }).then((photos) => {
      for (let photo of photos.photos) {
        this.toDataUrl(photo.webPath, (result) => {
          subscriber.next(result);
        })
      }
    });

    return subscriber;
  }

  showImages(imgs: Image[], startFrom: number = 0, mode: string = 'one') {
    PhotoViewer.show({
      images: imgs,
      mode: mode,
      startFrom: startFrom
    })
  }

  private toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}
