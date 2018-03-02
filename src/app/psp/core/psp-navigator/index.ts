import {NgModule} from '@angular/core';
import {PspNavigatorComponent} from './psp-navigator.component';
import {SharedModule} from '../../../shared/index';
import {DatePipe} from '@angular/common';
import {OrderByPipe} from '../../../shared/pipes/order-by.pipe';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    SharedModule,
    MatButtonModule,
  ],
  exports: [PspNavigatorComponent],
  declarations: [PspNavigatorComponent],
  providers: [DatePipe, OrderByPipe]
})
export class PspNavigatorModule {
}
