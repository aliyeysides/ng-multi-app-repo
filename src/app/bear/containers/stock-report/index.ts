import {NgModule} from '@angular/core';

import {routing} from './stock-report.routing';
import {StockReportComponent} from './stock-report.component';
import {ReportComponent} from './report';
import {SharedModule} from '../../../shared';
import {BearSymbolSearchModule} from '../../core/bear-search/bear-symbol-search';

@NgModule({
  imports: [
    routing,
    SharedModule,
    BearSymbolSearchModule
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
