import {ModalController} from "@ionic/angular";
export class AbstractModalController {
  constructor(protected modalCtrl: ModalController) {
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }
}
