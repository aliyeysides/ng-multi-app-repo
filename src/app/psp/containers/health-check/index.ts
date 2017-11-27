import {NgModule} from '@angular/core';
import {HealthCheckComponent} from './health-check.component';
import {routing} from './health-check.routing';
import {HealthCheckService} from '../../../services/health-check.service';
import {StockMovementsComponent} from './stock-movements/stock-movements.component';

@NgModule({
  imports: [routing],
  exports: [HealthCheckComponent],
  declarations: [
    HealthCheckComponent,
    StockMovementsComponent
  ],
  providers: [HealthCheckService]
})
export class HealthCheckModule {
}
