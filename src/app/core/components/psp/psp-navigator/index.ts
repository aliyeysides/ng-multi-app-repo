import {NgModule} from '@angular/core';
import {PspNavigatorComponent} from './psp-navigator.component';
import {SharedModule} from '../../../../shared/index';
import {DatePipe} from '@angular/common';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [PspNavigatorComponent],
  declarations: [PspNavigatorComponent],
  providers: [DatePipe]
})
export class PspNavigatorModule {
}
