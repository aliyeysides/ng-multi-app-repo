import {NgModule} from '@angular/core';
import {PspMarketSummaryComponent} from './market-summary.component';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {SharedModule} from '../../../shared';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [PspMarketSummaryComponent],
  declarations: [PspMarketSummaryComponent],
  providers: [MarketsSummaryService]
})
export class PspMarketSummaryModule {
}
