import { Component, Input, OnInit } from '@angular/core';
import { AbstractModalController } from '../../controller/ModalController';
import { ModalController } from '@ionic/angular';
import { BuyService } from 'src/app/menu/shop/services/buy.service';
import { IUser } from 'src/app/interfaces/i-user';
import { UserCollectionService } from 'src/app/services/user/user-collection.service';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-boost',
  templateUrl: './boost.component.html',
  styleUrls: ['./boost.component.scss'],
})
export class BoostComponent extends AbstractModalController implements OnInit {

  @Input() rang: number;
  @Input() user: IUser;
  intervalOptions: any[] = [
    'everyHour', 'every2Hour', 'every4Hour', 'every6Hour', 'every8Hour', 'every12Hour', 'every24Hour'
  ];

  constructor(protected modalCtrl: ModalController, private buyService: BuyService, private userCollectionService: UserCollectionService,
    private userApiService: UserApiService) {
    super(modalCtrl);
   }

  ngOnInit() {
    if (!this.user.boostSettings) {
      this.user.boostSettings = {
        isInterval: false
      };
    }

    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    })
  }

  setBoost() {
    return this.buyService.setBoost(this.user).then(() => this.closeModal());
  }

  async setInterval() {
    if (this.user.boostSettings.isInterval) {
      if (!this.user.boostSettings.interval) {
        this.user.boostSettings.interval = "everyHour";
      }

      await this.userCollectionService.set(this.user.id, this.user);
      await this.userApiService.setNextBoost(this.user.id);
    } else {
      delete this.user.boostSettings.nextBoostAt;
      this.userCollectionService.set(this.user.id, this.user)
    }
  }

  formatHour(time: any) {
    var splittedTime = time.toString().split(':');
    var h = splittedTime[0];
    var m = splittedTime[1];
    var s = splittedTime[2];

    if (parseInt(h) + 1 === 24) {
      h = '00';
    } else {
      h = (parseInt(h) + 1 > 9 ? '' : '0') + (parseInt(h) + 1);
    }

    return h + ':' + m + ':' + s;
  }
}
