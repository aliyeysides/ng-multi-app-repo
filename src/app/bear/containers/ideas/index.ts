import {NgModule} from '@angular/core';
import {routing} from './ideas.routing';

import {IdeasComponent} from './ideas.component';
import {SharedModule} from '../../../shared/index';
import {ListViewComponent} from './list-view/list-view.component';
import {ChartComponent} from './list-view/chart-view.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {IdeasService} from '../../../services/ideas.service';

import {TooltipModule} from 'ngx-bootstrap';

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
  providers: []
})
export class IdeasModule {
}
