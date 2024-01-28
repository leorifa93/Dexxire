import {NgModule} from "@angular/core";
import {AgePipe} from "./age.pipe";

@NgModule({
  declarations: [
    AgePipe
  ],
  exports: [
    AgePipe
  ]
})
export class AgePipeModule {}
