import {NgModule} from '@angular/core';
import {MyStocksComponent} from './my-stocks.component';
import {routing} from './my-stocks.routing';
import {MyStocksListComponent} from './my-stocks-list/my-stocks-list.component';
import {StockReportComponent} from './stock-report/stock-report.component';
import {SharedModule} from '../../../shared/index';

import {TooltipModule, BsDropdownModule} from 'ngx-bootstrap';
import {ReportService} from '../../../services/report.service';

@NgModule({
  imports: [
    routing,
    SharedModule,
    TooltipModule,
    BsDropdownModule,
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
