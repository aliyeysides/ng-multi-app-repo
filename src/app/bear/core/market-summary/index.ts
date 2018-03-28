import {NgModule} from '@angular/core';
import {BearMarketSummaryComponent} from './market-summary.component';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {SharedModule} from '../../../shared';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [BearMarketSummaryComponent],
  declarations: [BearMarketSummaryComponent],
  providers: [MarketsSummaryService]
})
export class BearMarketSummaryModule {
}
