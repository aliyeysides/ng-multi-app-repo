import {NgModule} from '@angular/core';
import {HealthCheckComponent} from './health-check.component';
import {routing} from './health-check.routing';
import {HealthCheckService} from '../../../core/services/health-check.service';

@NgModule({
  imports: [routing],
  exports: [HealthCheckComponent],
  declarations: [HealthCheckComponent],
  providers: [HealthCheckService]
})
export class HealthCheckModule {
}
