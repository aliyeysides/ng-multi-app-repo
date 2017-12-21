import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MarketBeatComponent} from './market-beat.component';
import {PspAuthGuard} from '../../../shared/guards/psp-auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'market-beat', component: MarketBeatComponent, canActivate: [PspAuthGuard] }
]);

