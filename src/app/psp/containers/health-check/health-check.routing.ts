import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '../../../shared/auth.guard';
import {HealthCheckComponent} from './health-check.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'health-check', component: HealthCheckComponent, canActivate: [AuthGuard] }
]);

