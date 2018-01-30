import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MarketBeatComponent} from './bear-of-the-week.component';
import {PspAuthGuard} from '../../../shared/guards/psp-auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'market-insights', component: MarketBeatComponent, canActivate: [PspAuthGuard] }
]);

