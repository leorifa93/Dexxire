import {Component, Input, OnInit} from '@angular/core';
import {UploadService} from "../../services/upload.service";
import {Gender} from "../../../constants/User";
import {AbstractModalController} from "../../controller/ModalController";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-avatars',
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss'],
})
export class AvatarsComponent extends AbstractModalController implements OnInit {

  @Input() gender: Gender;

  avatars: string[] = [];
  constructor(private uploadService: UploadService, protected modalCtrl: ModalController) {
    super(modalCtrl);
  }

  ngOnInit() {
    if (this.gender === Gender.Male) {
      this.uploadService.listFolder('Dexxire/avatars/male').subscribe((res) => {
        if (res) {
          this.avatars.push(res);
        }
      })
    } else if (this.gender === Gender.Female || this.gender === Gender.Transsexual) {
      this.uploadService.listFolder('Dexxire/avatars/female').subscribe((res) => {
        if (res) {
          this.avatars.push(res);
        }
      })
    }
  }

  choose(img: string) {
    return this.modalCtrl.dismiss({
      avatar: img
    })
  }
}
