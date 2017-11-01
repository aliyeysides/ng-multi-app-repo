import {NgModule} from '@angular/core';
import {routing} from './dashboard.routing';

import {SharedModule} from '../../shared/index';

import {DashboardComponent} from './dashboard.component';
import {BearishInsightsComponent} from './bearish-insights/bearish-insights.component';
import {BearOfTheWeekComponent} from './bear-of-the-week/bear-of-the-week.component';
import {BestBearIdeasComponent} from './best-bear-ideas/best-bear-ideas.component';
import {UserListsComponent} from './user-lists/user-lists.component';

import {BsModalService} from 'ngx-bootstrap';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PreviousInsightsModalComponent} from './bearish-insights/modals/previous-modal.component';
import {PreviousBearsModalComponent} from './bear-of-the-week/modals/previous-modal.component';
import {InsightsCommentaryModalComponent} from './bearish-insights/modals/commentary-modal.component';
import {WeeklyCommentaryModalComponent} from './bear-of-the-week/modals/commentary-modal.component';
import {WordpressService} from '../../core/services/wordpress.service';
import {DatePipe} from '@angular/common';

@NgModule({
  imports: [
    routing,
    SharedModule,
    ModalModule.forRoot()
  ],
  exports: [DashboardComponent],
  declarations: [
    DashboardComponent,
    BearishInsightsComponent,
    BearOfTheWeekComponent,
    BestBearIdeasComponent,
    UserListsComponent,
    PreviousInsightsModalComponent,
    PreviousBearsModalComponent,
    InsightsCommentaryModalComponent,
    WeeklyCommentaryModalComponent,
  ],
  entryComponents: [
    PreviousInsightsModalComponent,
    PreviousBearsModalComponent,
    InsightsCommentaryModalComponent,
    WeeklyCommentaryModalComponent,
  ],
  providers: [BsModalService, WordpressService, DatePipe]
})
export class DashboardModule {
}
