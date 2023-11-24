import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {SwipeControlsComponent} from "./swipe-controls.component";
import {IonicModule} from "@ionic/angular";


@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    IonicModule
  ],
  declarations: [
    SwipeControlsComponent
  ],
  exports: [
    SwipeControlsComponent
  ]
})
export class SwipeControlsModule { }
