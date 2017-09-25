import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {routing} from './dashboard.routing';

@NgModule({
  imports: [
    routing
  ],
  exports: [DashboardComponent],
  declarations: [DashboardComponent],
  providers: []
})
export class DashboardModule {
}
