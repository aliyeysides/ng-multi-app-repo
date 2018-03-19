import {NgModule} from '@angular/core';
import {StockReportComponent} from './stock-report.component';
import {AnchorOptionsComponent} from './anchor-options.component';
import {SharedModule} from '../../../../shared';
import {TooltipModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    TooltipModule
  ],
  exports: [StockReportComponent],
  declarations: [StockReportComponent, AnchorOptionsComponent],
  providers: []
})
export class StockReportModule {}
