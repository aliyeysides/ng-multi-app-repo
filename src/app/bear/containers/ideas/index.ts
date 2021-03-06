import {NgModule} from '@angular/core';
import {routing} from './ideas.routing';

import {IdeasComponent} from './ideas.component';
import {SharedModule} from '../../../shared/index';
import {ListViewComponent} from './list-view/list-view.component';
import {ChartComponent} from './list-view/chart-view.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

import {TooltipModule} from 'ngx-bootstrap';
import {ReportService} from '../../../services/report.service';

@NgModule({
  imports: [
    routing,
    SharedModule,
    InfiniteScrollModule,
    TooltipModule.forRoot()
  ],
  exports: [
    IdeasComponent
  ],
  declarations: [
    IdeasComponent,
    ListViewComponent,
    ChartComponent
  ],
  providers: [ReportService]
})
export class IdeasModule {
}
