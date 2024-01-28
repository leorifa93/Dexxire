import {NgModule} from "@angular/core";
import {SharedModule} from "../../modules/shared.module";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientModule} from "@angular/common/http";
import {IonicModule} from "@ionic/angular";
import {CongratulationsComponent} from "./congratulations.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LazyLoadImageModule,
    TranslateModule,
    HttpClientModule,
    IonicModule
  ],
  declarations: [CongratulationsComponent],
  exports: [CongratulationsComponent]
})
export class CongratulationsModule {

}
