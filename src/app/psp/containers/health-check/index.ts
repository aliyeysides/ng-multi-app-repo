import {NgModule} from '@angular/core';
import {routing} from './health-check.routing';

import {HealthCheckComponent} from './health-check.component';
import {StockMovementsComponent} from './stock-movements/stock-movements.component';
import {PortfolioOverviewComponent} from './portfolio-overview/portfolio-overview.component';
import {RatingChangesComponent} from './rating-changes/rating-changes.component';
import {EarningsReportComponent} from './earnings-report/earnings-report.component';
import {PowerGridComponent} from './power-grid/power-grid.component';
import {ReportingCalendarComponent} from './earnings-report/reporting-calendar/reporting-calendar.component';
import {SharedModule} from '../../../shared/index';

import {TooltipModule, BsDropdownModule} from 'ngx-bootstrap';
import {MarketsSummaryService} from '../../../services/markets-summary.service';
import {HealthCheckService} from '../../../services/health-check.service';
import {MatExpansionModule, MatIconModule, MatMenuModule} from '@angular/material';

@NgModule({
  imports: [
    routing,
    SharedModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
  ],
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
  providers: [MarketsSummaryService, HealthCheckService]
})
export class HealthCheckModule {
}
