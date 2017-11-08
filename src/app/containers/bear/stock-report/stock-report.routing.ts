import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {StockReportComponent} from './stock-report.component';
import {AuthGuard} from '../../../shared/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'report/:symbol', component: StockReportComponent, canActivate: [AuthGuard] }
]);
