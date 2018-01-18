import {NgModule} from '@angular/core';
import {MarketBeatComponent} from './market-beat.component';
import {routing} from './market-beat.routing';
import {WordpressService} from '../../../services/wordpress.service';
import {SharedModule} from '../../../shared/index';
import {BsDropdownModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    routing,
    SharedModule,
    BsDropdownModule.forRoot()
  ],
  exports: [MarketBeatComponent],
  declarations: [MarketBeatComponent],
  providers: [WordpressService]
})
export class MarketBeatModule {
}
