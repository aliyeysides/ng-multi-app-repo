import {NgModule} from '@angular/core';
import {MarketBeatComponent} from './market-beat.component';
import {routing} from './market-beat.routing';

@NgModule({
  imports: [routing],
  exports: [MarketBeatComponent],
  declarations: [MarketBeatComponent],
  providers: []
})
export class MarketBeatModule {
}
