import {NgModule} from '@angular/core';
import {routing} from './my-stocks.routing';
import {MyStocksComponent} from './my-stocks.component';
import {MyStocksListComponent} from './my-stocks-list';
import {StockReportComponent} from './stock-report';
import {SharedModule} from '../../../shared';

import {ReportService} from '../../../services/report.service';
import {TooltipModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    routing,
    SharedModule,
    TooltipModule
  ],
  exports: [MyStocksComponent],
  declarations: [
    MyStocksComponent,
    MyStocksListComponent,
    StockReportComponent
  ],
  providers: [ReportService],
})
export class MyStocksModule {
}
