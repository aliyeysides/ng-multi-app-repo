import {NgModule} from '@angular/core';

import {routing} from './stock-report.routing';
import {StockReportComponent} from './stock-report.component';
import {ReportComponent} from './report/report.component';
import {SharedModule} from '../../shared/index';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  exports: [StockReportComponent],
  declarations: [
    StockReportComponent,
    ReportComponent
  ],
  providers: []
})
export class StockReportModule {
}
