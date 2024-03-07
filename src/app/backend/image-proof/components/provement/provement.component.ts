import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AbstractModalController } from 'src/app/_shared/controller/ModalController';
import { CameraService } from 'src/app/_shared/services/camera.service';
import { ImageProofService } from 'src/app/backend/services/image-proof.service';
import { IUser } from 'src/app/interfaces/i-user';
import { UserCollectionService } from 'src/app/services/user/user-collection.service';

@Component({
  selector: 'app-provement',
  templateUrl: './provement.component.html',
  styleUrls: ['./provement.component.scss'],
})
export class ProvementComponent extends AbstractModalController  implements OnInit {

  @Input() userId: string;
  @Input() id: string;
  user: IUser;
  hasAllProved: boolean = false;

  constructor(protected modalCtrl: ModalController, private userService: UserCollectionService, private cameraService: CameraService,
    private imageProofService: ImageProofService) { 
    super(modalCtrl);
  }

  ngOnInit() {
    this.userService.get(this.userId).then((user) => {
      this.user = user;
    })
  }

  showImg(picture: string) {
    const imgs = [{url: picture}];

    this.cameraService.showImages(imgs);
  }

  remove(i: number) {
    this.user.publicAlbum = this.user.publicAlbum.filter((picture, index) => {
        return i !== index;
    });

    this.checkAllProvements();
  }

  async checkAllProvements() {
    await this.userService.set(this.user.id, this.user);

    if (!this.user.profilePictures.approved) {
      return false;
    }

    if (this.user.publicAlbum) {
      for (let picture of this.user.publicAlbum) {
        if (!picture.approved) {
          return false;
        }
      }
    }

    this.hasAllProved = true;

    return this.imageProofService.remove(this.id);
  }

  setAllProved() {
    this.user.profilePictures.approved = true;

    if (this.user.publicAlbum) {
      for (let picture of this.user.publicAlbum) {
        picture.approved = true;
      }
    } 
    
    this.checkAllProvements();
  }
}
