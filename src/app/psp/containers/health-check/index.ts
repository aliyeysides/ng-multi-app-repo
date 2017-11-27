import {NgModule} from '@angular/core';
import {HealthCheckComponent} from './health-check.component';
import {routing} from './health-check.routing';
import {HealthCheckService} from '../../../services/health-check.service';
import {StockMovementsComponent} from './stock-movements/stock-movements.component';
import {PortfolioOverviewComponent} from './portfolio-overview/portfolio-overview.component';

@NgModule({
  imports: [routing],
  exports: [HealthCheckComponent],
  declarations: [
    HealthCheckComponent,
    StockMovementsComponent,
    PortfolioOverviewComponent
  ],
  providers: [HealthCheckService]
})
export class HealthCheckModule {
}
