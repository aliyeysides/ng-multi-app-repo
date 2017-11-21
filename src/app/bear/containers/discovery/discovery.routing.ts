import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DiscoveryComponent} from './discovery.component';
import {AuthGuard} from '../../../shared/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'discovery/:symbol', component: DiscoveryComponent, canActivate: [AuthGuard] }
]);


