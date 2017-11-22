import {NgModule} from '@angular/core';
import {routing} from './discovery.routing';

import {DiscoveryService} from '../../../services/discovery.service';
import {SharedModule} from '../../../shared/index';
import {SignalService} from '../../../services/signal.service';

import {DiscoveryComponent} from './discovery.component';
import {DiscoverySeedComponent} from './discovery-seed/discovery-seed.component';
import {DiscoveryResultsComponent} from './discovery-results/discovery-results.component';
import {DiscoveryCardComponent} from './discovery-results/discovery-card/discovery-card.component';

@NgModule({
  imports: [
    routing,
    SharedModule
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

