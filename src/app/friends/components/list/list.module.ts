import {NgModule} from "@angular/core";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {ListComponent} from "./list.component";
import {UserCardModule} from "../../../_shared/components/user-card/user-card.module";
import {SwipeControlsModule} from "../../../_shared/components/swipe-controls/swipe-controls.module";

@NgModule({
    imports: [
        CommonModule,
        LazyLoadImageModule,
        TranslateModule,
        IonicModule,
        UserCardModule,
        SwipeControlsModule
    ],
  declarations: [ListComponent],
  exports: [ListComponent]
})
export class ListModule {

}
