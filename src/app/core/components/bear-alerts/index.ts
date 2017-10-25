import {NgModule} from '@angular/core';
import {BearAlertsComponent} from './bear-alerts.component';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [SharedModule],
  exports: [BearAlertsComponent],
  declarations: [BearAlertsComponent],
  providers: []
})
export class BearAlertsModule {
}
