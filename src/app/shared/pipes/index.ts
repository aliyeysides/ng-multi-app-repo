import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EvenOddPipe} from './even-odd.pipe';
import {OrderByPipe} from './order-by.pipe';
import {DecimalPipe} from './decimal.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    EvenOddPipe,
    OrderByPipe,
    DecimalPipe
  ],
  declarations: [EvenOddPipe, OrderByPipe, DecimalPipe]
})
export class PipesModule {
}
