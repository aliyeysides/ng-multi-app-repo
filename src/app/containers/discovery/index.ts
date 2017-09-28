import {NgModule} from '@angular/core';
import {DiscoveryComponent} from './discovery.component';
import {routing} from './discovery.routing';
import {DiscoverySeedComponent} from './discovery-seed/discovery-seed.component';
import {DiscoveryService} from '../../core/services/discovery.service';
import {SharedModule} from '../../shared/index';
import {SignalService} from '../../core/services/signal.service';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  exports: [DiscoveryComponent],
  declarations: [
    DiscoveryComponent,
    DiscoverySeedComponent
  ],
  providers: [DiscoveryService, SignalService]
})
export class DiscoveryModule {
}

