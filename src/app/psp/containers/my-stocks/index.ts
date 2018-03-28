import {NgModule} from '@angular/core';
import {routing} from './my-stocks.routing';
import {MyStocksComponent} from './my-stocks.component';
import {MyStocksListComponent} from './my-stocks-list';
import {SharedModule} from '../../../shared';

import {ReportService} from '../../../services/report.service';
import {StockReportModule} from './stock-report';

@NgModule({
  imports: [
    routing,
    SharedModule,
    StockReportModule
  ],
  exports: [MyStocksComponent],
  declarations: [
    MyStocksComponent,
    MyStocksListComponent,
  ],
  providers: [ReportService],
})
export class MyStocksModule {
}
