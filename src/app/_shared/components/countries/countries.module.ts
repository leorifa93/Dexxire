import {NgModule} from "@angular/core";
import {SharedModule} from "../../modules/shared.module";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {HttpClientModule} from "@angular/common/http";
import {IonicModule} from "@ionic/angular";
import { CountriesComponent } from "./countries.component";
import { FormsModule } from "@angular/forms";
import { FilterModule } from "../../pipes/filter.module";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LazyLoadImageModule,
    TranslateModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    FilterModule
  ],
  declarations: [CountriesComponent],
  exports: [CountriesComponent]
})
export class CountriesModule {

}
