import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {TranslateModule} from "@ngx-translate/core";
import {TextBannerComponent} from "./text-banner.component";

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    TranslateModule
  ],
  declarations: [
    TextBannerComponent
  ],
  exports: [
    TextBannerComponent
  ]
})
export class TextBannerModule {

}
