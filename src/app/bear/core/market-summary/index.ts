import {NgModule} from '@angular/core';
import {MarketSummaryComponent} from './market-summary.component';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [MarketSummaryComponent],
  declarations: [MarketSummaryComponent],
  providers: [MarketsSummaryService]
})
export class MarketSummaryModule {
}
