import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '../../../shared/guards/auth.guard';
import {MarketBeatComponent} from './market-beat.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'market-beat', component: MarketBeatComponent, canActivate: [AuthGuard] }
]);

