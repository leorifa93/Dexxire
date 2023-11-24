import {NgModule} from "@angular/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient} from "@angular/common/http";
import {LazyLoadImageModule} from "ng-lazyload-image";


@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule
  ]
})
export class SharedModule { }
