import { Component, OnInit } from '@angular/core';
import {AbstractModalController} from "../../controller/ModalController";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss'],
})
export class CongratulationsComponent extends AbstractModalController implements OnInit {

  constructor(protected modalCtrl: ModalController) {
    super(modalCtrl);
  }

  ngOnInit() {}

}
