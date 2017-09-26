import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {StockReportComponent} from './stock-report.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'report', component: StockReportComponent }
]);
