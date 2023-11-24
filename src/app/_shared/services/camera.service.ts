import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() {
  }

  async getPicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    return new Promise((resolve) => {
      resolve('data:image/jpg;base64,' + image.base64String);
    });
  }
}
