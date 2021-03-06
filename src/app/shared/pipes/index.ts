import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EvenOddPipe} from './even-odd.pipe';
import {OrderByPipe} from './order-by.pipe';
import {DecimalPipe} from './decimal.pipe';
import {MarketCapPipe} from './market-cap.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    EvenOddPipe,
    OrderByPipe,
    DecimalPipe,
    MarketCapPipe
  ],
  declarations: [EvenOddPipe, OrderByPipe, DecimalPipe, MarketCapPipe]
})
export class PipesModule {
}
