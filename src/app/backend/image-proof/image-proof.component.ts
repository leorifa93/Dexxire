import { Component, OnInit } from '@angular/core';
import { ImageProofService } from '../services/image-proof.service';
import { CollectionService } from 'src/app/services/collection.service';
import { ModalController } from '@ionic/angular';
import { ProvementComponent } from './components/provement/provement.component';

@Component({
  selector: 'app-image-proof',
  templateUrl: './image-proof.component.html',
  styleUrls: ['./image-proof.component.scss'],
})
export class ImageProofComponent implements OnInit {

  provements: any[] = [];

  constructor(private imageProofService: ImageProofService, private modalCtrl: ModalController) {
    this.imageProofService.getAll(10, null, null, 'uploadAt', null, true, (snapshot) => {
      this.provements = CollectionService.getSnapshotDataFromCollection(this.provements, snapshot);
      console.log(this.provements);
    })
  }

  ngOnInit() { }

  async showProvement(provement: any) {
    const modal = await this.modalCtrl.create({
      component: ProvementComponent,
      componentProps: {
        userId: provement.userId,
        id: provement.id
      }
    });

    modal.present();
  }
}
