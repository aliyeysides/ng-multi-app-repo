import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HealthCheckComponent} from './health-check.component';
import {PspAuthGuard} from '../../../shared/guards/psp-auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'health-check', component: HealthCheckComponent, canActivate: [PspAuthGuard] }
]);

