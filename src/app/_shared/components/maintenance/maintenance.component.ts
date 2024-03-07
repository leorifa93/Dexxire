import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent  implements OnInit {

  password: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  closeModal() {
    if (this.password === 'Dummy12345!') {
      this.modalCtrl.dismiss();
    }
  }
}
