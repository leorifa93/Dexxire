import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {UserCardComponent} from "./user-card.component";
import {VipBannerModule} from "../vip-banner/vip-banner.module";
import {AppModule} from "../../../app.module";
import {AgePipeModule} from "../../pipes/age.pipe.module";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";


@NgModule({
    imports: [
        CommonModule,
        LazyLoadImageModule,
        VipBannerModule,
        AgePipeModule,
        TranslateModule,
        IonicModule
    ],
  declarations: [
    UserCardComponent,
  ],
  exports: [
    UserCardComponent
  ]
})
export class UserCardModule {
}
