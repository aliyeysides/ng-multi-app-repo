import {NgModule} from '@angular/core';
import {DiscoveryComponent} from './discovery.component';
import {routing} from './discovery.routing';
import {DiscoverySeedComponent} from './discovery-seed/discovery-seed.component';
import {DiscoveryService} from '../../core/services/discovery.service';

@NgModule({
  imports: [
    routing
  ],
  exports: [DiscoveryComponent],
  declarations: [
    DiscoveryComponent,
    DiscoverySeedComponent
  ],
  providers: [DiscoveryService]
})
export class DiscoveryModule {
}

