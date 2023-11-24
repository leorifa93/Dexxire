import {NgModule} from "@angular/core";
import {SharedModule} from "../../modules/shared.module";
import {LanguagesComponent} from "./languages.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LazyLoadImageModule,
    TranslateModule,
    HttpClientModule
  ],
  declarations: [LanguagesComponent],
  exports: [LanguagesComponent]
})
export class LanguagesModule {

}
