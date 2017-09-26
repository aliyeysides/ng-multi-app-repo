import {NgModule} from '@angular/core';

import {routing} from './stock-report.routing';
import {StockReportComponent} from './stock-report.component';
import {ReportComponent} from './report/report.component';

@NgModule({
  imports: [
    routing
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
