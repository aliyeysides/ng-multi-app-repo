import {NgModule} from '@angular/core';
import {routing} from './dashboard.routing';

import {DashboardComponent} from './dashboard.component';
import {IdeaListsComponent} from './idea-lists/idea-lists.component';
import {BearishInsightsComponent} from './bearish-insights/bearish-insights.component';
import {BearOfTheWeekComponent} from './bear-of-the-week/bear-of-the-week.component';
import {BestBearIdeasComponent} from './best-bear-ideas/best-bear-ideas.component';
import {UserListsComponent} from './user-lists/user-lists.component';

import {ModalModule} from 'ngx-bootstrap/modal';
import {PreviousModalComponent} from './bearish-insights/previous-modal/previous-modal.component';
import {SharedModule} from '../../shared/index';
import {BsModalService} from 'ngx-bootstrap';

@NgModule({
  imports: [
    routing,
    SharedModule,
    ModalModule.forRoot()
  ],
  exports: [DashboardComponent],
  declarations: [
    DashboardComponent,
    IdeaListsComponent,
    BearishInsightsComponent,
    BearOfTheWeekComponent,
    BestBearIdeasComponent,
    UserListsComponent,
    PreviousModalComponent
  ],
  providers: [BsModalService]
})
export class DashboardModule {
}
