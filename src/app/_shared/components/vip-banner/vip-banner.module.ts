import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {VipBannerComponent} from "./vip-banner.component";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    TranslateModule
  ],
  declarations: [
    VipBannerComponent
  ],
  exports: [
    VipBannerComponent
  ]
})
export class VipBannerModule { }
