import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";

@Component({
  selector: 'app-vip-banner',
  templateUrl: './vip-banner.component.html',
  styleUrls: ['./vip-banner.component.scss'],
})
export class VipBannerComponent  implements OnInit {

  @Input() user: IUser;

  constructor() { }

  ngOnInit() {}

}
