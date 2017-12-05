import {NgModule} from '@angular/core';
import {MyStocksComponent} from './my-stocks.component';
import {routing} from './my-stocks.routing';
import {MyStocksListComponent} from './my-stocks-list/my-stocks-list.component';
import {StockReportComponent} from './stock-report/stock-report.component';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  exports: [MyStocksComponent],
  declarations: [
    MyStocksComponent,
    MyStocksListComponent,
    StockReportComponent
  ],
  providers: []
})
export class MyStocksModule {
}
