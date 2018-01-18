import {NgModule} from '@angular/core';
import {PspNavigatorComponent} from './psp-navigator.component';
import {SharedModule} from '../../../shared/index';
import {DatePipe} from '@angular/common';
import {HealthCheckService} from '../../../services/health-check.service';
import {OrderByPipe} from '../../../shared/pipes/order-by.pipe';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [PspNavigatorComponent],
  declarations: [PspNavigatorComponent],
  providers: [DatePipe, OrderByPipe]
})
export class PspNavigatorModule {
}
