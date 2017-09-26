import {NgModule} from '@angular/core';
import {MarketSummaryComponent} from './market-summary.component';
import {MarketsSummaryService} from '../../services/markets-summary.service';

@NgModule({
  imports: [],
  exports: [MarketSummaryComponent],
  declarations: [MarketSummaryComponent],
  providers: [MarketsSummaryService]
})
export class MarketSummaryModule {
}
