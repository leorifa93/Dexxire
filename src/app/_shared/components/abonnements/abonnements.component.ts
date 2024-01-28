import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MembershipPrice} from "../../../constants/User";
import {IUser} from "../../../interfaces/i-user";

@Component({
  selector: 'app-abonnements',
  templateUrl: './abonnements.component.html',
  styleUrls: ['./abonnements.component.scss'],
})
export class AbonnementsComponent  implements OnInit {
  @Output() onBuy: EventEmitter<any> = new EventEmitter<any>();
  @Input() me: IUser;
  subscriptions: any[] = [
    {
      title: 'GOLDMEMBER',
      price: MembershipPrice.Gold,
      priceTitle: '84',
      benefits: ['PEOPLESINAREA', 'GOLDMARK', 'BETTERRANG'],
      class: 'gold',
      type: 'gold'
    },
    {
      title: 'VIPMEMBER',
      price: MembershipPrice.VIP,
      priceTitle: '224',
      benefits: ['PEOPLESINAREA', 'PREFEREDPROFILE', 'VIPMARK'],
      class: 'vip',
      type: 'vip'
    }
  ]
  constructor() { }

  ngOnInit() {}

  buy(subscription) {
    this.onBuy.emit(subscription);
  }
}
