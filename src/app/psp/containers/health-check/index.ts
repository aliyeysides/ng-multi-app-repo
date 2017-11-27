import {NgModule} from '@angular/core';
import {routing} from './health-check.routing';

import {HealthCheckComponent} from './health-check.component';
import {HealthCheckService} from '../../../services/health-check.service';
import {StockMovementsComponent} from './stock-movements/stock-movements.component';
import {PortfolioOverviewComponent} from './portfolio-overview/portfolio-overview.component';
import {RatingChangesComponent} from './rating-changes/rating-changes.component';
import {EarningsReportComponent} from './earnings-report/earnings-report.component';
import {PowerGridComponent} from './power-grid/power-grid.component';
import {ReportingCalendarComponent} from './earnings-report/reporting-calendar/reporting-calendar.component';

@NgModule({
  imports: [routing],
  exports: [HealthCheckComponent],
  declarations: [
    HealthCheckComponent,
    StockMovementsComponent,
    PortfolioOverviewComponent,
    RatingChangesComponent,
    EarningsReportComponent,
    PowerGridComponent,
    ReportingCalendarComponent
  ],
  providers: [HealthCheckService]
})
export class HealthCheckModule {
}
