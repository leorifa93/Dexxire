import {Component, Input, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";

@Component({
  selector: 'app-swipe-controls',
  templateUrl: './swipe-controls.component.html',
  styleUrls: ['./swipe-controls.component.scss'],
})
export class SwipeControlsComponent  implements OnInit {

  @Input() user: IUser;
  constructor() { }

  ngOnInit() {}

}
