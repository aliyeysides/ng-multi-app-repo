import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard.component';
import {AuthGuard} from '../../../shared/guards/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
]);

