import {NgModule} from '@angular/core';
import {routing} from './discovery.routing';

import {DiscoveryService} from '../../../services/discovery.service';
import {SharedModule} from '../../../shared';
import {SignalService} from '../../../services/signal.service';

import {DiscoveryComponent} from './discovery.component';
import {DiscoverySeedComponent} from './discovery-seed';
import {DiscoveryResultsComponent} from './discovery-results';
import {DiscoveryCardComponent} from './discovery-results/discovery-card';
import {BearSymbolSearchModule} from '../../core/bear-search/bear-symbol-search';

@NgModule({
  imports: [
    routing,
    SharedModule,
    BearSymbolSearchModule
  ],
  exports: [DiscoveryComponent],
  declarations: [
    DiscoveryComponent,
    DiscoverySeedComponent,
    DiscoveryResultsComponent,
    DiscoveryCardComponent
  ],
  providers: [DiscoveryService, SignalService]
})
export class DiscoveryModule {
}

