import {NgModule} from '@angular/core';
import {PspNavigatorComponent} from './psp-navigator.component';
import {SharedModule} from '../../../shared/index';
import {DatePipe} from '@angular/common';
import {HealthCheckService} from '../../../services/health-check.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [PspNavigatorComponent],
  declarations: [PspNavigatorComponent],
  providers: [DatePipe, HealthCheckService]
})
export class PspNavigatorModule {
}
