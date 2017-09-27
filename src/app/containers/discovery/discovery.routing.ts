import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DiscoveryComponent} from './discovery.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'discovery', redirectTo: 'discovery/AAPL' },
  { path: 'discovery/:symbol', component: DiscoveryComponent }
]);


