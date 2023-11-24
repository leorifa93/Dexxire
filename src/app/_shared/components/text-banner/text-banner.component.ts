import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-banner',
  templateUrl: './text-banner.component.html',
  styleUrls: ['./text-banner.component.scss'],
})
export class TextBannerComponent  implements OnInit {

  @Input() textKey: string;
  constructor() { }

  ngOnInit() {}

}
